// Copyright 2017-2019 @polkadot/api-contract authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { createType } from '@polkadot/types';
import RxBase from './RxBase';
// NOTE Experimental, POC, bound to change
export default class RxContract extends RxBase {
  constructor(api, abi, address) {
    super(api, abi);
    this.calls = {};
    this.address = createType('Address', address);
    Object.entries(this.abi.messages).forEach(([name]) => {
      this.calls[name] = fn => (value, maxGas, ...params) =>
        this.apiContracts.call(this.address, value, maxGas, fn(...params));
    });
  }
}
