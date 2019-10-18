// Copyright 2017-2019 @polkadot/api-contract authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { map } from 'rxjs/operators';
import { SubmittableResult } from '@chainx/api';
import { compactAddLength, u8aToU8a } from '@chainx/util';
import RxBase from './RxBase';
import RxBlueprint from './RxBlueprint';

class CodePutCodeResult extends SubmittableResult {
  constructor(result, blueprint) {
    super(result);
    this.blueprint = blueprint;
  }
}

// NOTE Experimental, POC, bound to change
export default class RxCode extends RxBase {
  constructor(api, abi, wasm) {
    super(api, abi);
    this.createResult = result => {
      let blueprint;
      if (result.isFinalized) {
        const record = result.findRecord('contract', 'CodeStored');
        if (record) {
          blueprint = new RxBlueprint(this.api, this.abi, record.event.data[0]);
        }
      }
      return new CodePutCodeResult(result, blueprint);
    };
    this.code = u8aToU8a(wasm);
  }
  createBlueprint(maxGas) {
    const signAndSend = account => {
      return this.apiContracts
        .putCode(maxGas, compactAddLength(this.code))
        .signAndSend(account)
        .pipe(map(this.createResult));
    };
    return { signAndSend };
  }
}
