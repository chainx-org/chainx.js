// Copyright 2017-2018 @polkadot/rpc-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import EventEmitter from 'eventemitter3';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { isFunction, isUndefined } from '@chainx/util';

import Rpc from '@chainx/rpc-core';

/**
 * @name RpcRx
 * @summary The RxJS API is a wrapper around the API.
 * @description It allows wrapping API components with observables using RxJS.
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import RpcRx from '@chainx/rpc-rx';
 * import WsProvider from '@chainx/rpc-provider/ws';
 *
 * const provider = new WsProvider('http://127.0.0.1:9944');
 * const api = new RpcRx(provider);
 * ```
 */
export default class RpcRx {
  /**
   * @param  {ProviderInterface} provider An API provider using HTTP or WebSocket
   */
  constructor(providerOrRpc) {
    this._api = providerOrRpc instanceof Rpc ? providerOrRpc : new Rpc(providerOrRpc);
    this._cacheMap = {};
    this._eventemitter = new EventEmitter();
    this._isConnected = new BehaviorSubject(this._api._provider.isConnected());
    this.initEmitters(this._api._provider);

    this.author = this.createInterface('author', this._api.author);
    this.chain = this.createInterface('chain', this._api.chain);
    this.state = this.createInterface('state', this._api.state);
    this.system = this.createInterface('system', this._api.system);
    this.chainx = this.createInterface('chainx', this._api.chainx);
  }

  isConnected() {
    return this._isConnected;
  }

  on(type, handler) {
    this._eventemitter.on(type, handler);
  }

  emit(type, ...args) {
    this._eventemitter.emit(type, ...args);
  }

  initEmitters(provider) {
    provider.on('connected', () => {
      this._isConnected.next(true);
      this.emit('connected');
    });
    provider.on('disconnected', () => {
      this._isConnected.next(false);
      this.emit('disconnected');
    });
  }

  createInterface(sectionName, section) {
    return Object.keys(section)
      .filter(name => !['subscribe', 'unsubscribe'].includes(name))
      .reduce((observables, name) => {
        observables[name] = this.createObservable(`${sectionName}_${name}`, name, section);
        return observables;
      }, {});
  }

  createObservable(subName, name, section) {
    if (isFunction(section[name].unsubscribe)) {
      return this.createCachedObservable(subName, name, section);
    }

    return (...params) =>
      from(
        section[name].apply(null, params).catch(error => {
          console.error(error);
        })
      );
  }

  createCachedObservable(subName, name, section) {
    if (!this._cacheMap[subName]) {
      this._cacheMap[subName] = {};
    }
    return (...params) => {
      const paramStr = JSON.stringify(params);
      if (!this._cacheMap[subName][paramStr]) {
        this._cacheMap[subName][paramStr] = this.createReplay(name, params, section, subName, paramStr);
      }
      return this._cacheMap[subName][paramStr];
    };
  }

  createReplay(name, params, section, subName, paramStr) {
    return Observable.create(observer => {
      const fn = section[name];
      const callback = this.createReplayCallback(observer);
      const subscribe = fn(...params, callback).catch(error => observer.next(error));
      return this.createReplayUnsub(fn, subscribe, subName, paramStr);
    }).pipe(
      map(value => {
        if (value instanceof Error) {
          throw value;
        }
        return value;
      }),
      publishReplay(1),
      refCount()
    );
  }

  createReplayCallback(observer) {
    let cachedResult;
    return result => {
      if (
        isUndefined(cachedResult) ||
        !Array.isArray(cachedResult) ||
        !Array.isArray(result) ||
        result.length !== cachedResult.length
      ) {
        cachedResult = result;
      } else {
        cachedResult = cachedResult.map((cachedValue, index) =>
          isUndefined(result[index]) ? cachedValue : result[index]
        );
      }
      observer.next(cachedResult);
    };
  }

  createReplayUnsub(fn, subscribe, subName, paramStr) {
    return () => {
      subscribe
        .then(subscriptionId => fn.unsubscribe(subscriptionId))
        .then(() => {
          delete this._cacheMap[subName][paramStr];
        })
        .catch(error => {
          console.error('Unsubscribe failed', error);
        });
    };
  }
}
