// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Enum from './codec/Enum';
/**
 * @name NewAccountOutcome
 * @description
 * Enum to track the outcome for creation of an [[AccountId]]
 */
export default class NewAccountOutcome extends Enum {
  constructor(index) {
    super(['NoHint', 'GoodHint', 'BadHint'], index);
  }
}
