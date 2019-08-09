// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { hexToU8a, isHex, isU8a, u8aToHex } from '@chainx/util';
import { blake2AsU8a } from '@chainx/util-crypto';
import Compact from './codec/Compact';
import Struct from './codec/Struct';
import ExtrinsicSignature from './ExtrinsicSignature';
import Hash from './Hash';
import Method from './Method';

/**
 * @name Extrinsic
 * @description
 * Representation of an Extrinsic in the system. It contains the actual call,
 * (optional) signature and encodes with an actual length prefix
 *
 * {@link https://github.com/paritytech/wiki/blob/master/Extrinsic.md#the-extrinsic-format-for-node}.
 *
 * Can be:
 * - signed, to create a transaction
 * - left as is, to create an inherent
 */
export default class Extrinsic extends Struct {
  constructor(value) {
    super(
      {
        signature: ExtrinsicSignature,
        method: Method,
      },
      Extrinsic.decodeExtrinsic(value || {})
    );
  }
  static decodeExtrinsic(value) {
    if (isHex(value)) {
      const u8a = hexToU8a(value);
      return Extrinsic.decodeExtrinsic(u8a);
    } else if (isU8a(value)) {
      const [offset, length] = Compact.decodeU8a(value);
      return value.subarray(offset, offset + length.toNumber());
    } else if (value instanceof Method) {
      return {
        method: value,
      };
    }
    return value;
  }
  /**
   * @description The arguments passed to for the call, exposes args so it is compatible with [[Method]]
   */
  get args() {
    return this.method.args;
  }
  /**
   * @description The actual `[sectionIndex, methodIndex]` as used in the Method
   */
  get callIndex() {
    return this.method.callIndex;
  }
  /**
   * @description The actual data for the Method
   */
  get data() {
    return this.method.data;
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    const length = this.length;
    return length + Compact.encodeU8a(length).length;
  }
  /**
   * @description Convernience function, encodes the extrinsic and returns the actual hash
   */
  get hash() {
    return new Hash(blake2AsU8a(this.toU8a(), 256));
  }
  /**
   * @description `true` id the extrinsic is signed
   */
  get isSigned() {
    return this.signature.isSigned;
  }
  /**
   * @description The length of the encoded value
   */
  get length() {
    return this.toU8a(true).length;
  }
  /**
   * @description The [[FunctionMetadata]] that describes the extrinsic
   */
  get meta() {
    return this.method.meta;
  }
  /**
   * @description The [[Method]] this extrinsic wraps
   */
  get method() {
    return this.get('method');
  }
  /**
   * @description The [[ExtrinsicSignature]]
   */
  get signature() {
    return this.get('signature');
  }

  encodeMessage(address, nonce, acceleration, blockHash, era) {
    return this.signature.encodeMessage(this.method, address, nonce, acceleration, blockHash, era);
  }

  /**
   * @description Add an [[ExtrinsicSignature]] to the extrinsic (already generated)
   */
  addSignature(signer, signature, nonce, era) {
    this.signature.addSignature(signer, signature, nonce, era);
    return this;
  }
  /**
   * @description Sign the extrinsic with a specific keypair
   */
  sign(signerPair, nonce, acceleration, blockHash, era) {
    this.signature.sign(this.method, signerPair, nonce, acceleration, blockHash, era);
    return this;
  }
  /**
   * @description Returns a hex string representation of the value
   */
  toHex() {
    return u8aToHex(this.toU8a());
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    return this.toHex();
  }
  /**
   * @description Encodes the value as a Uint8Array as per the parity-codec specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    const encoded = super.toU8a();
    return isBare ? encoded : Compact.addLengthPrefix(encoded);
  }
}
