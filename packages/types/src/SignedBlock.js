// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Struct from './codec/Struct';
import Block from './Block';
import Justification from './Justification';
/**
 * @name SignedBlock
 * @description
 * A [[Block]] that has been signed and contains a [[Justification]]
 */
export default class SignedBlock extends Struct {
  constructor(value) {
    super(
      {
        block: Block,
        justification: Justification,
      },
      value
    );
    this._raw = value;
  }
  // raw
  get raw() {
    return this._raw;
  }
  /**
   * @description The wrapped [[Block]]
   */
  get block() {
    return this.get('block');
  }
  /**
   * @description Block/header [[Hash]]
   */
  get hash() {
    return this.block.hash;
  }
  /**
   * @description The wrapped [[Justification]]
   */
  get justification() {
    return this.get('justification');
  }
}
