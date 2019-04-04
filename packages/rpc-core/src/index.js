// Copyright 2017-2018 @polkadot/rpc-core authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import interfaces from '@chainx/jsonrpc';
import WsProvider from '@chainx/rpc-provider/ws';
import { createType } from '@chainx/types/codec';

import { ExtError, assert, isFunction, logger } from '@polkadot/util';
const l = logger('rpc-core');
/**
 * @name Rpc
 * @summary The API may use a HTTP or WebSockets provider.
 * @description It allows for querying a Polkadot Client Node.
 * WebSockets provider is recommended since HTTP provider only supports basic querying.
 *
 * ```mermaid
 * graph LR;
 *   A[Api] --> |WebSockets| B[WsProvider];
 *   B --> |endpoint| C[ws://127.0.0.1:9944]
 * ```
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import Api from '@polkadot/rpc-core';
 * import WsProvider from '@polkadot/rpc-provider/ws';
 *
 * const provider = new WsProvider('ws://127.0.0.1:9944');
 * const api = new Api(provider);
 * ```
 */
export default class Rpc {
  /**
   * @constructor
   * Default constructor for the Api Object
   * @param  {ProviderInterface} provider An API provider using HTTP or WebSocket
   */
  constructor(provider = new WsProvider()) {
    assert(provider && isFunction(provider.send), 'Expected Provider to API create');
    this._provider = provider;
    this.author = this.createInterface(interfaces.author);
    this.chain = this.createInterface(interfaces.chain);
    this.state = this.createInterface(interfaces.state);
    this.system = this.createInterface(interfaces.system);
    this.chainx = this.createInterface(interfaces.chainx);
  }

  /**
   * @name signature
   * @summary Returns a string representation of the method with inputs and outputs.
   * @description
   * Formats the name, inputs and outputs into a human-readable string. This contains the input parameter names input types and output type.
   *
   * @example
   * <BR>
   *
   * ```javascript
   * import Api from '@polkadot/rpc-core';
   *
   * Api.signature({ name: 'test_method', params: [ { name: 'dest', type: 'Address' } ], type: 'Address' }); // => test_method (dest: Address): Address
   * ```
   */
  static signature({ method, params, type }) {
    const inputs = params.map(({ name, type }) => `${name}: ${type}`).join(', ');
    return `${method} (${inputs}): ${type}`;
  }

  createInterface({ methods }) {
    return Object.keys(methods).reduce((exposed, method) => {
      const def = methods[method];
      exposed[method] = def.isSubscription ? this.createMethodSubscribe(def) : this.createMethodSend(def);
      return exposed;
    }, {});
  }

  createMethodSend(method) {
    const rpcName = `${method.section}_${method.method}`;
    const call = async (...values) => {
      // TODO Warn on deprecated methods
      try {
        const params = this.formatInputs(method, values);
        const paramsJson = params.map(param => param.toJSON());
        const result = await this._provider.send(rpcName, paramsJson);
        return this.formatOutput(method, params, result);
      } catch (error) {
        const message = `${Rpc.signature(method)}:: ${error.message}`;
        l.error(message);
        throw new ExtError(message, error.code, undefined);
      }
    };
    return call;
  }

  createMethodSubscribe(method) {
    const [updateType, subMethod, unsubMethod] = method.pubsub;
    const subName = `${method.section}_${subMethod}`;
    const unsubName = `${method.section}_${unsubMethod}`;
    const subscriptionType = `${method.section}_${updateType}`;
    const unsubscribe = subscriptionId => this._provider.unsubscribe(subscriptionType, unsubName, subscriptionId);
    const _call = async (...values) => {
      try {
        const cb = values.pop();
        assert(isFunction(cb), `Expected callback in last position of params`);
        const params = this.formatInputs(method, values);
        const paramsJson = params.map(param => param.toJSON());
        if (method.method === 'submitAndWatchExtrinsic') {
          const update = (error, result) => {
            if (error) {
              l.error(`${Rpc.signature(method)}:: ${error.message}`);
              return;
            }
            cb(null, this.formatOutput(method, params, result));
          };
          // 交易的错误处理
          return this._provider.subscribe(subscriptionType, subName, paramsJson, update).catch(err => {
            cb(err);
          });
        } else {
          const update = (error, result) => {
            if (error) {
              l.error(`${Rpc.signature(method)}:: ${error.message}`);
              return;
            }
            cb(this.formatOutput(method, params, result));
          };
          return this._provider.subscribe(subscriptionType, subName, paramsJson, update);
        }
      } catch (error) {
        const message = `${Rpc.signature(method)}:: ${error.message}`;
        l.error(message);
        throw new ExtError(message, error.code, undefined);
      }
    };
    const call = _call;
    call.unsubscribe = unsubscribe;
    return call;
  }

  formatInputs(method, inputs) {
    const reqArgCount = method.params.filter(({ isOptional }) => !isOptional).length;
    const optText = reqArgCount === method.params.length ? '' : ` (${method.params.length - reqArgCount} optional)`;
    assert(
      inputs.length >= reqArgCount && inputs.length <= method.params.length,
      `Expected ${method.params.length} parameters${optText}, ${inputs.length} found instead`
    );
    return inputs.map((input, index) => createType(method.params[index].type, input));
  }

  formatOutput(method, params, result) {
    // chainx rpc 直接返回 JSON
    if (method.type === 'RawJSON') {
      return result;
    }
    const base = createType(method.type, result);
    if (method.type === 'StorageData') {
      // single return value (via state.getStorage), decode the value based on the
      // outputType that we have specified. Fallback to Data on nothing
      const type = params[0].outputType || 'Data';
      return createType(type, base);
    } else if (method.type === 'StorageChangeSet') {
      // multiple return values (via state.storage subscription), decode the values
      // one at a time, all based on the query types. Three values can be returned -
      //   - Base - There is a valid value, non-empty
      //   - null - The storage key is empty (but in the resultset)
      //   - undefined - The storage value is not in the resultset
      return params[0].reduce((result, _key) => {
        // Fallback to Data (i.e. just the encoding) if we don't have a specific type
        const type = _key.outputType || 'Data';
        // see if we have a result value for this specific key
        const key = _key.toHex();
        const item = base.changes.find(item => item.key.toHex() === key);
        // if we don't have a value, do not fill in the entry, it will be up to the
        // caller to sort this out, either ignoring or having a cache for older values
        result.push(!item ? undefined : item.value.isNone ? null : createType(type, item.value.unwrap()));
        return result;
      }, []);
    }
    return base;
  }
}
