// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Struct from './codec/Struct';
import Vector from './codec/Vector';
import { BftAuthoritySignature } from './Bft';
import Bytes from './Bytes';
import Hash from './Hash';
import U32 from './U32';
/**
 * @name Justification
 * @description
 * A generic justification as a stream of [[Bytes]], this is specific per consensus implementation
 */
export default class Justification extends Bytes {}
/**
 * @name RhdJustification
 * @description
 * [[Justification]] for the Rhododendron consensus algorithm
 */
export class RhdJustification extends Struct {
  constructor(value) {
    super(
      {
        roundNumber: U32,
        hash: Hash,
        signatures: Vector.with(BftAuthoritySignature),
      },
      value,
      new Map([['roundNumber', 'round_number']])
    );
  }
  /**
   * @description The justification [[Hash]]
   */
  get hash() {
    return this.get('hash');
  }
  /**
   * @description The round this justification wraps as a [[U32]]
   */
  get roundNumber() {
    return this.get('roundNumber');
  }
  /**
   * @description The [[BftAuthoritySignature]] array
   */
  get signatures() {
    return this.get('signatures');
  }
}
