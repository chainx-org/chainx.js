// Copyright 2017-2019 @polkadot/api-contract authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { map } from 'rxjs/operators';
import { SubmittableResult } from '@chainx/api';
import { createType } from '@chainx/types';
import { assert } from '@chainx/util';
import RxBase from './RxBase';
import RxContract from './RxContract';

class BlueprintCreateResult extends SubmittableResult {
  constructor(result, contract) {
    super(result);
    this.contract = contract;
  }
}

export default class Blueprint extends RxBase {
  constructor(api, abi, codeHash) {
    super(api, abi);
    this.createResult = result => {
      let contract;
      if (result.isFinalized) {
        const record = result.findRecord('contract', 'Instantiated');
        if (record) {
          contract = new RxContract(this.api, this.abi, record.event.data[1]);
        }
      }
      return new BlueprintCreateResult(result, contract);
    };
    this.codeHash = createType('Hash', codeHash);
  }
  deployContract(constructorIndex = 0, endowment, maxGas, ...params) {
    assert(!!this.abi.constructors[constructorIndex], `Specified constructor index ${constructorIndex} does not exist`);
    const signAndSend = account => {
      return this.apiContracts
        .create(endowment, maxGas, this.codeHash, this.abi.constructors[constructorIndex](...params))
        .signAndSend(account)
        .pipe(map(this.createResult));
    };
    return { signAndSend };
  }
}
