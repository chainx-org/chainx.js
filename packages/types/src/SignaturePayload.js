// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { blake2AsU8a } from '@chainx/util-crypto';

import Struct from './codec/Struct';
import Compact from './codec/Compact';
import Method from './Method';
import Hash from './Hash';
import Nonce from './Nonce';
import ExtrinsicEra from './ExtrinsicEra';
import Acceleration from './Acceleration';
/**
 * @name SignaturePayload
 * @description
 * A signing payload for an [[Extrinsic]]. For the final encoding, it is variable length based
 * on the conetnts included
 *
 *   8 bytes: The Transaction Index/Nonce as provided in the transaction itself.
 *   2+ bytes: The Function Descriptor as provided in the transaction itself.
 *   2 bytes: The Transaction Era as provided in the transaction itself.
 *   32 bytes: The hash of the authoring block implied by the Transaction Era and the current block.
 */
export default class SignaturePayload extends Struct {
  constructor(value) {
    super(
      {
        nonce: Compact.with(Nonce),
        method: Method,
        era: ExtrinsicEra,
        blockHash: Hash,
        acceleration: Compact.with(Acceleration),
      },
      value
    );
  }
  /**
   * @description `true` if the payload refers to a valid signature
   */
  get isSigned() {
    return !!(this._signature && this._signature.length === 64);
  }
  /**
   * @description The block [[Hash]] the signature applies to (mortal/immortal)
   */
  get blockHash() {
    return this.get('blockHash');
  }
  /**
   * @description The [[Method]] contained in the payload
   */
  get method() {
    return this.get('method');
  }
  /**
   * @description The [[ExtrinsicEra]]
   */
  get era() {
    return this.get('era');
  }
  /**
   * @description The [[Nonce]]
   */
  get nonce() {
    return this.get('nonce');
  }

  /**
   * 倍率
   */
  get acceleration() {
    return this.get('acceleration');
  }

  /**
   * @description The raw signature as a `Uint8Array`
   */
  get signature() {
    if (!this.isSigned) {
      throw new Error('Transaction is not signed');
    }
    return this._signature;
  }
  /**
   * @description Sign the payload with the keypair
   */
  sign(signerPair) {
    const encoded = this.encode();

    this._signature = signerPair.sign(encoded);

    return this._signature;
  }

  encode() {
    const u8a = this.toU8a();
    const encoded = u8a.length > 256 ? blake2AsU8a(u8a) : u8a;

    return encoded;
  }
}
