// Copyright 2017-2018 @polkadot/rpc-provider authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import logger from '@chainx/util/logger';
import EventEmitter from 'eventemitter3';

import './polyfill';
import assert from '../assert';
import Coder from '../coder';
import defaults from '../defaults';

const l = logger('api-ws');

/**
 * # @polkadot/rpc-provider/ws
 *
 * @name WsProvider
 *
 * @description The WebSocket Provider allows sending requests using WebSocket to a WebSocket RPC server TCP port. Unlike the [[HttpProvider]], it does support subscriptions and allows listening to events such as new blocks or balance changes.
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import Api from '@chainx/api/promise';
 * import WsProvider from '@chainx/rpc-provider/ws';
 *
 * const provider = new WsProvider('ws://127.0.0.1:9944');
 * const api = new Api(provider);
 * ```
 *
 * @see [[HttpProvider]]
 */
export default class WsProvider {
  _isConnected = false;

  /**
   * @param {string}  endpoint    The endpoint url. Usually `ws://ip:9944` or `wss://ip:9944`
   * @param {boolean} autoConnect Whether to connect automatically or not.
   */
  constructor(endpoint = defaults.WS_URL, autoConnect = true) {
    assert(/^(wss|ws):\/\//.test(endpoint), `Endpoint should start with 'ws://', received '${endpoint}'`);
    this._eventemitter = new EventEmitter();
    this.autoConnect = autoConnect;
    this.coder = new Coder();
    this.endpoint = endpoint;
    this.handlers = {};
    this.queued = {};
    this.subscriptions = {};
    this.websocket = null;
    if (autoConnect) {
      this.connect();
    }
  }

  /**
   * @summary `true` when this provider supports subscriptions
   */
  get hasSubscriptions() {
    return true;
  }

  /**
   * @summary Manually connect
   * @description The [[WsProvider]] connects automatically by default, however if you decided otherwise, you may
   * connect manually using this method.
   */
  connect() {
    try {
      this.websocket = new WebSocket(this.endpoint);
      this.websocket.onclose = this.onSocketClose;
      this.websocket.onerror = this.onSocketError;
      this.websocket.onmessage = this.onSocketMessage;
      this.websocket.onopen = this.onSocketOpen;
    } catch (error) {
      l.error(error);
    }
  }

  /**
   * @summary Whether the node is connected or not.
   * @return {boolean} true if connected
   */
  isConnected() {
    return this._isConnected;
  }

  /**
   * @summary Listens on events after having subscribed using the [[subscribe]] function.
   * @param  {ProviderInterface$Emitted} type Event
   * @param  {ProviderInterface$EmitCb}  sub  Callback
   */
  on(type, sub) {
    this._eventemitter.on(type, sub);
  }

  onSocketClose = event => {
    l.error(
      `disconnected from ${this.endpoint}::${event.code}: ${event.reason}${this.autoConnect ? ', will reconnect.' : ''}`
    );
    this._isConnected = false;
    this.emit('disconnected');
    if (this.autoConnect) {
      setTimeout(() => {
        this.connect();
      }, 1000);
    }
  };

  onSocketError = error => {
    l.debug(() => ['socket error', error]);
    this.emit('error', error);
  };

  onSocketMessage = message => {
    const response = JSON.parse(message.data);
    try {
      if (!this.handlers[response.id] || this.handlers[response.id].method !== 'state_getMetadata') {
        l.debug(() => ['received', message.data]);
      }
    } catch {}
    return !response.method ? this.onSocketMessageResult(response) : this.onSocketMessageSubscribe(response);
  };

  onSocketMessageResult = response => {
    const handler = this.handlers[response.id];
    if (!handler) {
      l.debug(() => `Unable to find handler for id=${response.id}`);
      return;
    }
    try {
      const { method, params, subscription } = handler;
      const result = this.coder.decodeResponse(response);
      if (subscription) {
        this.subscriptions[`${subscription.type}::${result}`] = {
          ...subscription,
          method,
          params,
        };
      }
      handler.callback(null, result);
    } catch (error) {
      handler.callback(error, undefined);
    }
    delete this.handlers[response.id];
  };

  onSocketMessageSubscribe = response => {
    const subscription = `${response.method}::${response.params.subscription}`;
    const handler = this.subscriptions[subscription];
    if (!handler) {
      l.debug(() => `Unable to find handler for subscription=${subscription}`);
      return;
    }
    try {
      const result = this.coder.decodeResponse(response);
      handler.callback(null, result);
    } catch (error) {
      handler.callback(error, undefined);
    }
  };

  onSocketOpen = () => {
    assert(this.websocket, 'WebSocket cannot be null in onOpen');
    l.debug(() => ['connected to', this.endpoint]);
    this._isConnected = true;
    this.emit('connected');
    this.sendQueue();
    this.resubscribe();
    return true;
  };

  /**
   * @summary Send JSON data using WebSockets to configured HTTP Endpoint or queue.
   * @param method The RPC methods to execute
   * @param params Encoded paramaters as appliucable for the method
   * @param subscription Subscription details (internally used)
   */
  async send(method, params, subscription) {
    return new Promise((resolve, reject) => {
      try {
        const json = this.coder.encodeJson(method, params);
        const id = this.coder.getId();
        const callback = (error, result) => {
          error ? reject(error) : resolve(result);
        };
        l.debug(() => ['calling', json, !!subscription]);
        this.handlers[id] = {
          callback,
          method,
          params,
          subscription,
        };
        if (this.isConnected() && this.websocket) {
          this.websocket.send(json);
        } else {
          this.queued[id] = json;
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @name subscribe
   * @summary Allows subscribing to a specific event.
   * @param  {string}                     type     Subscription type
   * @param  {string}                     method   Subscription method
   * @param  {Array<any>}                 params   Parameters
   * @param  {ProviderInterface$Callback} callback Callback
   * @return {Promise<number>}                     Promise resolving to the dd of the subscription you can use with [[unsubscribe]].
   *
   * @example
   * <BR>
   *
   * ```javascript
   * const provider = new WsProvider('ws://127.0.0.1:9944');
   * const rpc = new Rpc(provider);
   *
   * rpc.state.subscribeStorage([[storage.balances.freeBalance, <Address>]], (_, values) => {
   *   console.log(values)
   * }).then((subscriptionId) => {
   *   console.log('balance changes subscription id: ', subscriptionId)
   * })
   * ```
   */
  async subscribe(type, method, params, callback) {
    const id = await this.send(method, params, { callback, type });
    return id;
  }

  /**
   * @summary Allows unsubscribing to subscriptions made with [[subscribe]].
   */
  async unsubscribe(type, method, id) {
    const subscription = `${type}::${id}`;
    // FIXME This now could happen with re-subscriptions. The issue is that with a re-sub
    // the assigned id now does not match what the API user originally received. It has
    // a slight complication in solving - since we cannot rely on the send id, but rather
    // need to find the actual subscription id to map it
    if (!this.subscriptions[subscription]) {
      l.debug(() => `Unable to find active subscription=${subscription}`);
      return false;
    }
    delete this.subscriptions[subscription];
    const result = await this.send(method, [id]);
    return result;
  }

  emit(type, ...args) {
    this._eventemitter.emit(type, ...args);
  }

  resubscribe() {
    const subscriptions = this.subscriptions;
    this.subscriptions = {};
    Object.keys(subscriptions).forEach(async id => {
      const { callback, method, params, type } = subscriptions[id];
      try {
        await this.subscribe(type, method, params, callback);
      } catch (error) {
        l.error(error);
      }
    });
  }

  sendQueue() {
    Object.keys(this.queued).forEach(id => {
      try {
        // @ts-ignore we have done the websocket check in onSocketOpen, if an issue, will catch it
        this.websocket.send(this.queued[id]);
        delete this.queued[id];
      } catch (error) {
        l.error(error);
      }
    });
  }

  disconnect() {
    if (!this.websocket) {
      throw new Error('Cannot disconnect on a non-open websocket');
    }

    // switch off autoConnect, we are in manual mode now
    this.autoConnect = false;

    // 1000 - Normal closure; the connection successfully completed
    this.websocket.close(1000);
    this.websocket = null;
  }

  clone() {
    return new WsProvider(this.endpoint);
  }
}
