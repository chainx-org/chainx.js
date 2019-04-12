// Copyright 2017-2018 @polkadot/rpc-provider authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import assert from './assert';

const knownErrorCode = {
  '0': 'Bad signature',
  '1': 'Nonce too low',
  '2': 'Nonce too high',
  '3': 'Sending account had too low a balance',
  '255': 'Block is full, no more extrinsics can be applied',
};

// 继承标准 Error
class RpcError extends Error {
  constructor({ code, message, data } = {}) {
    super();

    // 重写标准属性
    this.name = this.constructor.name;
    this.message = knownErrorCode[data] || `[${code}]: ${message}`;
    this.data = { code, message, data };

    // 错误栈的兼容处理
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export default class RpcCoder {
  constructor() {
    this.id = 0;
  }

  decodeResponse(response) {
    assert(response, 'Empty response object received');
    const isSubscription = response.params && response.method;
    assert(
      typeof response.id === 'number' || (isSubscription && typeof response.params.subscription === 'number'),
      'Invalid id field in decoded object'
    );
    this.checkError(response.error);
    assert(response.result !== undefined || isSubscription, 'No result found in JsonRpc response');
    if (isSubscription) {
      this.checkError(response.params.error);
      return response.params.result;
    }
    return response.result;
  }

  encodeJson(method, params) {
    return JSON.stringify(this.encodeObject(method, params));
  }

  encodeObject(method, params) {
    return {
      id: ++this.id,
      jsonrpc: '2.0',
      method,
      params,
    };
  }

  getId() {
    return this.id;
  }

  checkError(error) {
    if (error) {
      throw new RpcError(error);
    }
  }
}
