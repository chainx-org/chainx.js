import EventEmitter from 'eventemitter3';
import { catchError, map, of } from 'rxjs/operators';
import Rpc from '@chainx/rpc-core';
import { assert, isFunction, isObject, isUndefined, logger } from '@chainx/util';
import { setAddressPrefix } from '@chainx/keyring/address';
import { fromMetadata as extrinsicsFromMeta } from '@chainx/extrinsics';
import { fromMetadata as storageFromMeta } from '@chainx/storage';
import { typeRegistry as registry } from '@chainx/types/codec';
import { Event, Method, Extrinsic } from '@chainx/types';
import RpcRx from '@chainx/rpc-rx';
import { NET_PREFIX } from '@chainx/account';

import SubmittableExtrinsic from './SubmittableExtrinsic';

const l = logger('chainx-api');

const INIT_ERROR = `Api needs to be initialised before using, listen on 'ready'`;

export default class ApiBase {
  constructor(provider = {}, broadcast = []) {
    const options = isObject(provider) && isFunction(provider.send) ? { provider } : provider;

    this._broadcast = broadcast;
    this._eventemitter = new EventEmitter();
    this._rpcBase = new Rpc(options.provider);
    this._rpc$ = new RpcRx(this._rpcBase);

    if (options.types) {
      registry.register(options.types);
    }

    this.init();

    this._isReady = new Promise((resolveReady, rejectReady) =>
      this.once('ready', () => resolveReady(this)).once('error', () => rejectReady(this))
    );
  }

  get isReady() {
    return this._isReady;
  }

  get genesisHash() {
    assert(!isUndefined(this._genesisHash), INIT_ERROR);
    return this._genesisHash;
  }

  get hasSubscriptions() {
    return this._rpcBase._provider.hasSubscriptions;
  }

  get broadcast() {
    return this._broadcast;
  }

  get runtimeMetadata() {
    assert(!isUndefined(this._runtimeMetadata), INIT_ERROR);
    return this._runtimeMetadata;
  }

  get chainProperties() {
    assert(!isUndefined(this._chainProperties), INIT_ERROR);
    return this._chainProperties;
  }

  get runtimeVersion() {
    assert(!isUndefined(this._runtimeVersion), INIT_ERROR);
    return this._runtimeVersion;
  }

  get query() {
    assert(!isUndefined(this._query), INIT_ERROR);
    return this._query;
  }

  get query$() {
    assert(!isUndefined(this._query$), INIT_ERROR);
    return this._query$;
  }

  get rpc() {
    return this._rpcBase;
  }

  get rpc$() {
    return this._rpc$;
  }

  get tx() {
    assert(!isUndefined(this._extrinsics), INIT_ERROR);
    return this._extrinsics;
  }

  on(type, handler) {
    this._eventemitter.on(type, handler);
    return this;
  }

  once(type, handler) {
    this._eventemitter.once(type, handler);
    return this;
  }

  emit(type, ...args) {
    this._eventemitter.emit(type, ...args);
  }

  init() {
    let isReady = false;
    if (this._rpcBase._provider.hasSubscriptions) {
      this._rpcBase._provider.on('disconnected', () => {
        this.emit('disconnected');
      });
      this._rpcBase._provider.on('error', error => {
        this.emit('error', error);
      });
      this._rpcBase._provider.on('connected', async () => {
        this.emit('connected');
        const hasMeta = await this.loadMeta();
        if (hasMeta && !isReady) {
          isReady = true;
          this.emit('ready', this);
        }
      });
    } else {
      this.loadMeta().then(hasMeta => {
        if (hasMeta && !isReady) {
          isReady = true;
          this.emit('ready', this);
        }
      });
    }
  }

  disconnect() {
    this._rpcBase._provider.disconnect();
  }

  async loadMeta() {
    try {
      this._runtimeMetadata = await this._rpcBase.state.getMetadata();
      this._runtimeVersion = await this._rpcBase.chain.getRuntimeVersion();
      this._chainProperties = await this._rpcBase.system.properties();
      this._genesisHash = await this._rpcBase.chain.getBlockHash(0);

      const extrinsics = extrinsicsFromMeta(this.runtimeMetadata);
      const storage = storageFromMeta(this.runtimeMetadata);
      this._extrinsics = this.decorateExtrinsics(extrinsics);
      this._query = this.decorateGetStorage(storage, false);
      this._query$ = this.decorateSubscribeStorage(storage);
      Event.injectMetadata(this.runtimeMetadata);
      Method.injectMethods(extrinsics);

      // 设置网络类型
      if (
        this._chainProperties &&
        this._chainProperties.network_type &&
        NET_PREFIX[this._chainProperties.network_type]
      ) {
        setAddressPrefix(NET_PREFIX[this._chainProperties.network_type]);
      }

      return true;
    } catch (error) {
      l.error('loadMeta', error);
      return false;
    }
  }

  decorateFunctionMeta(input, output) {
    output.meta = input.meta;
    output.method = input.method;
    output.section = input.section;
    output.toJSON = input.toJSON;
    if (input.callIndex) {
      output.callIndex = input.callIndex;
    }
    return output;
  }

  /**
   * 解析 storage，使用 getStorage 方法，返回 observable 或 promise
   */
  decorateGetStorage(storage, returnObservable) {
    const getStorage = returnObservable ? this.rpc$.state.getStorage : this.rpc.state.getStorage;
    return Object.keys(storage).reduce((result, sectionName) => {
      const section = storage[sectionName];
      result[sectionName] = Object.keys(section).reduce((result, methodName) => {
        const method = section[methodName];
        const decorated = arg => {
          return getStorage([method, arg]);
        };
        decorated.at = (hash, arg) => getStorage([method, arg], hash);
        result[methodName] = this.decorateFunctionMeta(method, decorated);
        return result;
      }, {});
      return result;
    }, {});
  }

  /**
   * 解析 storage，使用 subscribeStorage 方法，返回 observable
   */
  decorateSubscribeStorage(storage) {
    return Object.keys(storage).reduce((result, sectionName) => {
      const section = storage[sectionName];
      result[sectionName] = Object.keys(section).reduce((result, methodName) => {
        const method = section[methodName];
        const decorated = arg => {
          return this.rpc$.state.subscribeStorage([[method, arg]]).pipe(
            // state_storage returns an array of values, since we have just subscribed to
            // a single entry, we pull that from the array and return it as-is
            map((result = []) => result[0])
          );
        };

        decorated.at = (hash, arg) => this.rpc$.state.getStorage([method, arg], hash);

        result[methodName] = this.decorateFunctionMeta(method, decorated);

        return result;
      }, {});
      return result;
    }, {});
  }

  /**
   * 解析 tx
   */
  decorateExtrinsics(extrinsics) {
    return Object.keys(extrinsics).reduce((result, sectionName) => {
      const section = extrinsics[sectionName];
      result[sectionName] = Object.keys(section).reduce((result, methodName) => {
        const method = section[methodName];
        const decorated = (...args) =>
          new SubmittableExtrinsic(this, new Extrinsic({ method: method(...args) }), this.broadcast);
        result[methodName] = this.decorateFunctionMeta(method, decorated);
        return result;
      }, {});
      return result;
    }, {});
  }
}
