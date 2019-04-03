// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Tuple from './codec/Tuple';
import AuthorityId from './AuthorityId';
import Hash from './Hash';
import Signature from './Signature';
/**
 * @name BftAuthoritySignature
 * @description
 * Represents a Bft Hash and Signature pairing, typically used in reporting
 * network behaviour.
 */
export class BftAuthoritySignature extends Tuple {
  constructor(value) {
    super([AuthorityId, Signature], value);
  }
  /**
   * @description The wrapped [[AuthoriyId]]
   */
  get authorityId() {
    return this[0];
  }
  /**
   * @description The wrapped [[Signature]] value
   */
  get signature() {
    return this[1];
  }
}
/**
 * @name BftHashSignature
 * @description
 * Represents a Bft Hash and Signature pairing, typically used in reporting
 * network behaviour.
 */
export class BftHashSignature extends Tuple {
  constructor(value) {
    super([Hash, Signature], value);
  }
  /**
   * @description The wrapped [[Hash]]
   */
  get hash() {
    return this[0];
  }
  /**
   * @description The wrapped [[Signature]]
   */
  get signature() {
    return this[1];
  }
}
