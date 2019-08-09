// Copyright 2017-2018 @polkadot/rpc-provider authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import logger from '@chainx/util/logger';

import './polyfill';
import assert from '../assert';
import Coder from '../coder';
import defaults from '../defaults';

const ERROR_SUBSCRIBE = 'HTTP Provider does not have subscriptions, use WebSockets instead';
const l = logger('api-http');

/**
 * # @polkadot/rpc-provider/https
 *
 * @name HttpProvider
 *
 * @description The HTTP Provider allows sending requests using HTTP to a HTTP RPC server TCP port. It does not support subscriptions so you won't be able to listen to events such as new blocks or balance changes. It is usually preferrable using the [[WsProvider]].
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import Api from '@chainx/api/promise';
 * import HttpProvider from '@chainx/rpc-provider/http';
 *
 * const provider = new HttpProvider('http://127.0.0.1:9933');
 * const api = new Api(provider);
 * ```
 *
 * @see [[WsProvider]]
 */
export default class HttpProvider {
  /**
   * @param {string} endpoint The endpoint url starting with http://
   */
  constructor(endpoint = defaults.HTTP_URL) {
    assert(/^(https|http):\/\//.test(endpoint), `Endpoint should start with 'http://', received '${endpoint}'`);
    this.coder = new Coder();
    this.endpoint = endpoint;
  }
  /**
   * @summary `true` when this provider supports subscriptions
   */
  get hasSubscriptions() {
    return false;
  }
  /**
   * @summary Whether the node is connected or not.
   * @return {boolean} true if connected
   */
  isConnected() {
    return true;
  }
  /**
   * @summary Events are not supported with the HttpProvider, see [[WsProvider]].
   * @description HTTP Provider does not have 'on' emitters. WebSockets should be used instead.
   */
  on(type, sub) {
    l.warn(`HTTP Provider does not have 'on' emitters, use WebSockets instead`);
  }
  /**
   * @summary Send HTTP POST Request with Body to configured HTTP Endpoint.
   */
  async send(method, params) {
    const body = this.coder.encodeJson(method, params);
    const request = {
      body,
      headers: {
        Accept: 'application/json',
        'Content-Length': `${body.length}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await fetch(this.endpoint, request);
    assert(response.ok, `[${response.status}]: ${response.statusText}`);
    const result = await response.json();
    return this.coder.decodeResponse(result);
  }
  /**
   * @summary Subscriptions are not supported with the HttpProvider, see [[WsProvider]].
   */
  async subscribe(types, method, params, cb) {
    l.error(ERROR_SUBSCRIBE);
    throw new Error(ERROR_SUBSCRIBE);
  }
  /**
   * @summary Subscriptions are not supported with the HttpProvider, see [[WsProvider]].
   */
  async unsubscribe(type, method, id) {
    l.error(ERROR_SUBSCRIBE);
    throw new Error(ERROR_SUBSCRIBE);
  }

  clone() {
    return new HttpProvider(this.endpoint);
  }

  disconnect() {
    // noop
  }
}
