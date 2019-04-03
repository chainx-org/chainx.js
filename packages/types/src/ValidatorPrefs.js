// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Struct from './codec/Struct';
import Balance from './Balance';
import U32 from './U32';
/**
 * @name ValidatorPrefs
 * @description
 * Validator preferences
 */
export default class ValidatorPrefs extends Struct {
  constructor(value) {
    super(
      {
        unstakeThreshold: U32,
        validatorPayment: Balance,
      },
      value
    );
  }
  /**
   * @description The unstake threshold as [[U32]]
   */
  get unstakeThreshold() {
    return this.get('unstakeThreshold');
  }
  /**
   * @description The payment config for the validator as [[Balance]]
   */
  get validatorPayment() {
    return this.get('validatorPayment');
  }
}
