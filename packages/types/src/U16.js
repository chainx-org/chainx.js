// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import UInt from './codec/UInt';
/**
 * @name U16
 * @description
 * An 16-bit unsigned integer
 */
export default class U16 extends UInt {
  constructor(value) {
    super(value, 16, false);
  }
}
