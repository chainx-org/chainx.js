// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Enum from './codec/Enum';

export default class StorageHasher extends Enum {
  constructor(value) {
    super(['Blake2_128', 'Blake2_256', 'Twox128', 'Twox256', 'Twox128Concat'], value);
  }
  /**
   * @description Is the enum Blake2_128?
   */
  get isBlake2128() {
    return this.toNumber() === 0;
  }
  /**
   * @description Is the enum Blake2_256?
   */
  get isBlake2256() {
    return this.toNumber() === 1;
  }
  /**
   * @description Is the enum Twox128?
   */
  get isTwox128() {
    return this.toNumber() === 2;
  }
  /**
   * @description Is the enum Twox256?
   */
  get isTwox256() {
    return this.toNumber() === 3;
  }
  /**
   * @description Is the enum isTwox128Concat?
   */
  get isTwox128Concat() {
    return this.toNumber() === 4;
  }
  toJSON() {
    // This looks prettier in the generated JSON
    return this.toString();
  }
}
