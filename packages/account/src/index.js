import bip32 from 'bip32';
import bs58 from 'bs58';

import {
  mnemonicGenerate,
  mnemonicToSeed,
  mnemonicValidate,
  randomAsHex,
  naclKeypairFromSecret,
  naclKeypairFromSeed,
  naclSign,
  naclVerify,
} from '@polkadot/util-crypto';

import { encodeAddress, decodeAddress } from '@polkadot/keyring/address';
import defaults from '@polkadot/keyring/address/defaults';
import { isHex, u8aToHex, bufferToU8a } from '@polkadot/util';
import encodePkcs8 from '@polkadot/keyring/pair/encode';
import decodePkcs8 from '@polkadot/keyring/pair/decode';
import { PKCS8_HEADER } from '@polkadot/keyring/pair/defaults';

import KeyStore from '@chainx/keystore';
import u8aFrom from './u8aFrom';

export const NET_PREFIX = {
  testnet: 42,
  mainnet: 44,
};

/**
 * 保持兼容 @polkadot/keyring/pair
 */
class Account {
  constructor(keyPair) {
    this._keyPair = keyPair;
  }

  privateKey = () => {
    return u8aToHex(this._keyPair.secretKey.subarray(0, 32));
  };

  publicKey = () => {
    return u8aToHex(this._keyPair.publicKey);
  };

  address = () => {
    return encodeAddress(this.publicKey());
  };

  pkcs8 = () => {
    const publicKey = this._keyPair.publicKey;
    const seed = this._keyPair.secretKey.subarray(0, 32);
    const encoded = encodePkcs8({ publicKey, seed });
    return u8aToHex(encoded);
  };

  sign = message => {
    return naclSign(message, this._keyPair);
  };

  verify = (message, signature) => {
    return naclVerify(message, signature, this._keyPair.publicKey);
  };

  derive = (path = "m/44'/239'/0'/0/0") => {
    const root = bip32.fromSeed(Buffer.from(this._keyPair.secretKey));
    const child = root.derivePath(path);
    return Account.fromSeed(child.privateKey);
  };

  static from(unknow) {
    if (Account.isMnemonicValid(unknow)) {
      return Account.fromMnemonic(unknow);
    }
    if (typeof unknow !== 'string') {
      const u8a = u8aFrom(unknow);
      if (u8a.length === 32) {
        return new Account(naclKeypairFromSeed(u8a));
      } else if (u8a.length === 64) {
        return new Account(naclKeypairFromSecret(u8a));
      } else {
        throw new Error('unexpect value');
      }
    } else if (isHex(unknow, 512)) {
      return Account.fromSecretKey(unknow);
    } else if (
      isHex(unknow, 680) &&
      u8aFrom(unknow)
        .subarray(0, PKCS8_HEADER.length)
        .toString() === PKCS8_HEADER.toString()
    ) {
      return Account.fromPkcs8(unknow);
    } else {
      return Account.fromSeed(unknow);
    }
  }

  static fromMnemonic(mnemonic) {
    const seed = mnemonicToSeed(mnemonic);
    return Account.fromSeed(seed);
  }

  static fromPrivateKey(privateKey) {
    return Account.fromSeed(privateKey);
  }

  static fromSeed(seedLike) {
    const seedU8a =
      typeof seedLike === 'string' && !isHex(seedLike, 256)
        ? u8aFrom(seedLike.padEnd(32, ' '), 'utf8')
        : u8aFrom(seedLike, 'hex');
    return new Account(naclKeypairFromSeed(seedU8a));
  }

  static fromText(text) {
    return Account.fromSeed(text);
  }

  static fromSecretKey(secretKey) {
    const secretKeyU8a = u8aFrom(secretKey, 'hex');
    return new Account(naclKeypairFromSecret(secretKeyU8a));
  }

  static fromPkcs8(encoded) {
    const decoded = decodePkcs8(null, u8aFrom(encoded));
    return Account.fromSeed(decoded.seed);
  }

  static fromJson(json, passphrase) {
    const encoded = json.encoded;
    if (!encoded) throw new Error('keystore 格式错误');
    const decoded = decodePkcs8(passphrase, u8aFrom(encoded));
    return Account.fromSeed(decoded.seed);
  }

  static fromKeyStore(json, password) {
    const privateKey = KeyStore.decrypt(json, password);
    return Account.fromPrivateKey(privateKey);
  }

  static generate() {
    const random = randomAsHex(32);
    return Account.fromSeed(random);
  }

  static newMnemonic() {
    return mnemonicGenerate();
  }

  static isMnemonicValid(mnemonic) {
    return mnemonicValidate(mnemonic);
  }

  static isAddressValid(address) {
    if (typeof address !== 'string') throw new Error('expect string');
    try {
      const decoded = bufferToU8a(bs58.decode(address));
      if (decoded[0] !== defaults.prefix) return false;
      this.decodeAddress(address);
    } catch {
      return false;
    }

    return true;
  }

  static encodeAddress(pulickey) {
    return encodeAddress(pulickey);
  }

  static decodeAddress(address) {
    return u8aToHex(decodeAddress(address));
  }

  encodePkcs8(passphrase) {
    const publicKey = this._keyPair.publicKey;
    const seed = this._keyPair.secretKey.subarray(0, 32);
    const encoded = encodePkcs8({ publicKey, seed }, passphrase);
    return {
      address: encodeAddress(publicKey),
      encoded: u8aToHex(encoded),
      encoding: {
        content: ['pkcs8', 'ed25519'],
        type: 'xsalsa20-poly1305',
        version: '1',
      },
    };
  }

  encrypt(password) {
    return KeyStore.encrypt(this.privateKey(), password);
  }
}

export default Account;
