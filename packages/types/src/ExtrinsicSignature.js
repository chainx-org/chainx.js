// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { isU8a, u8aConcat } from '@chainx/util';
import Struct from './codec/Struct';
import Compact from './codec/Compact';
import Address from './Address';
import ExtrinsicEra from './ExtrinsicEra';
import Nonce from './Nonce';
import Signature from './Signature';
import SignaturePayload from './SignaturePayload';
import Acceleration from './Acceleration';

export const IMMORTAL_ERA = new Uint8Array([0]);
const BIT_SIGNED = 0b10000000;
const BIT_UNSIGNED = 0;
const BIT_VERSION = 0b0000001;
const EMPTY_U8A = new Uint8Array();
/**
 * @name ExtrinsicSignature
 * @description
 * A container for the [[Signature]] associated with a specific [[Extrinsic]]
 */
export default class ExtrinsicSignature extends Struct {
  // Signature Information.
  //   1/3/5/9/33 bytes: The signing account identity, in Address format
  //   64 bytes: The Ed25519 signature of the Signing Payload
  //   8 bytes: The Transaction Index of the signing account
  //   1/2 bytes: The Transaction Era
  constructor(value) {
    super(
      {
        signer: Address,
        signature: Signature,
        nonce: Compact.with(Nonce),
        era: ExtrinsicEra,
        acceleration: Compact.with(Acceleration),
      },
      ExtrinsicSignature.decodeExtrinsicSignature(value)
    );
  }

  static decodeExtrinsicSignature(value) {
    if (!value) {
      return {};
    } else if (isU8a(value)) {
      const version = value[0];
      if ((version & BIT_SIGNED) === BIT_SIGNED) {
        return value.subarray(1);
      }
      return {};
    }
    return value;
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    // version has 1 byte, signature takes the rest
    return 1 + (this.isSigned ? super.encodedLength : 0);
  }

  /**
   * @description `true` if the signature is valid
   */
  get isSigned() {
    return this.signature.length !== 0;
  }

  /**
   * @description The [[ExtrinsicEra]] (mortal or immortal) this signature applies to
   */
  get era() {
    return this.get('era');
  }

  /**
   * @description The [[Nonce]] for the signature
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
   * @description The actuall [[Signature]] hash
   */
  get signature() {
    return this.get('signature');
  }

  /**
   * @description The [[Address]] that signed
   */
  get signer() {
    return this.get('signer');
  }

  /**
   * @description The encoded version for the signature
   */
  get version() {
    // Version Information.
    // 1 byte: version information:
    // - 7 low bits: version identifier (should be 0b0000001).
    // - 1 high bit: signed flag: 1 if this is a transaction (e.g. contains a signature).
    return BIT_VERSION | (this.isSigned ? BIT_SIGNED : BIT_UNSIGNED);
  }

  injectSignature(signature, signer, nonce, era, acceleration) {
    this.set('era', era);
    this.set('nonce', nonce);
    this.set('acceleration', acceleration);
    this.set('signer', signer);
    this.set('signature', signature);
    return this;
  }

  /**
   * @description Adds a raw signature
   */
  addSignature(_signer, _signature, _nonce, _acceleration, _era = IMMORTAL_ERA) {
    const signer = new Address(_signer);
    const nonce = new Nonce(_nonce);
    const era = new ExtrinsicEra(_era);
    const acceleration = new Acceleration(_acceleration);
    const signature = new Signature(_signature);
    return this.injectSignature(signature, signer, nonce, era, acceleration);
  }

  /**
   * @description Generate a payload and pplies the signature from a keypair
   */
  sign(method, signerPair, nonce, acceleration, blockHash, era = IMMORTAL_ERA) {
    const signer = new Address(signerPair.publicKey());
    const signingPayload = new SignaturePayload({
      nonce,
      method,
      era,
      blockHash,
      acceleration,
    });
    const signature = new Signature(signingPayload.sign(signerPair));
    return this.injectSignature(
      signature,
      signer,
      signingPayload.nonce,
      signingPayload.era,
      signingPayload.acceleration
    );
  }

  encodeMessage(method, address, nonce, acceleration, blockHash, era = IMMORTAL_ERA) {
    const signer = new Address(address);
    const signingPayload = new SignaturePayload({
      nonce,
      method,
      era,
      blockHash,
      acceleration,
    });

    this.injectMessage(signer, signingPayload.nonce, signingPayload.era, signingPayload.acceleration);

    return signingPayload.encode();
  }

  injectMessage(signer, nonce, era, acceleration) {
    this.set('era', era);
    this.set('nonce', nonce);
    this.set('acceleration', acceleration);
    this.set('signer', signer);
    return this;
  }

  appendSignature(_signature) {
    const signature = new Signature(_signature);
    this.set('signature', signature);
    return this;
  }

  /**
   * @description Encodes the value as a Uint8Array as per the parity-codec specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    return u8aConcat(new Uint8Array([this.version]), this.isSigned ? super.toU8a(isBare) : EMPTY_U8A);
  }
}
