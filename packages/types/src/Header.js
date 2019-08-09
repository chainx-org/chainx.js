// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { blake2AsU8a } from '@chainx/util-crypto';
import Compact from './codec/Compact';
import Struct from './codec/Struct';
import BlockNumber from './BlockNumber';
import Digest from './Digest';
import Hash from './Hash';
import BN from 'bn.js';
/**
 * @name Header
 * @description
 * A [[Block]] header
 */
export default class Header extends Struct {
  constructor(value) {
    super(
      {
        parentHash: Hash,
        stateRoot: Hash,
        extrinsicsRoot: Hash,
        digest: Digest,
      },
      value
    );
    this._raw = value;
  }
  // raw header
  get raw() {
    return this._raw;
  }
  /**
   * @description The wrapped [[BlockNumber]]
   */
  get blockNumber() {
    return new BN(parseInt(this._raw.number));
  }
  /**
   * @description The wrapped [[Digest]]
   */
  get digest() {
    return this.get('digest');
  }
  /**
   * @description The wrapped extrisics root as a [[Hash]]
   */
  get extrinsicsRoot() {
    return this.get('extrinsicsRoot');
  }
  /**
   * @description Convenience method, encodes the header and calculates the [[Hash]]
   */
  get hash() {
    return new Hash(blake2AsU8a(this.toU8a(), 256));
  }
  /**
   * @description The wrapped parent as a [[Hash]]
   */
  get parentHash() {
    return this.get('parentHash');
  }
  /**
   * @description The wrapped state root as a [[Hash]]
   */
  get stateRoot() {
    return this.get('stateRoot');
  }
}
