const crypto = require('crypto-browserify');
const blakejs = require('blakejs');
import hasPrefix from '@polkadot/util/hex/hasPrefix';
import stripPrefix from '@polkadot/util/hex/stripPrefix';
import addPrefix from '@polkadot/util/hex/addPrefix';

const iterations = 10240;

class KeyStore {
  static encrypt(rawPrivateKey, passphrase) {
    const privateKey = hasPrefix(rawPrivateKey) ? stripPrefix(rawPrivateKey) : rawPrivateKey;

    const salt = crypto.randomBytes(32);
    const derivedKey = crypto.pbkdf2Sync(passphrase, salt, iterations, 32, 'sha256');
    const derivedLeftKey = derivedKey.slice(0, 16);
    const derivedRightKey = derivedKey.slice(16);

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-128-ctr', derivedLeftKey, iv);

    const privateKeyInBuffer = Buffer.from(privateKey, 'hex');
    const ciphertext = cipher.update(privateKeyInBuffer);

    const macKey = Buffer.concat([derivedRightKey, ciphertext]);
    const mac = Buffer.from(blakejs.blake2b(macKey, null, 32));

    const raw = {
      iv,
      mac,
      salt,
      ciphertext,
      iterations,
    };

    return Object.entries(raw).reduce((result, [key, value]) => {
      if (value instanceof Buffer) {
        result[key] = value.toJSON().data;
      } else {
        result[key] = value;
      }
      return result;
    }, {});
  }

  static decrypt(encrypted, passphrase) {
    const normalized = Object.entries(encrypted).reduce((result, [key, value]) => {
      if (value.length) {
        result[key] = Buffer.from(value);
      } else {
        result[key] = value;
      }
      return result;
    }, {});

    const derivedKey = crypto.pbkdf2Sync(passphrase, normalized.salt, iterations, 32, 'sha256');
    const derivedLeftKey = derivedKey.slice(0, 16);
    const derivedRightKey = derivedKey.slice(16);

    const macKey = Buffer.concat([derivedRightKey, normalized.ciphertext]);
    const mac = Buffer.from(blakejs.blake2b(macKey, null, 32));

    if (!mac.equals(normalized.mac)) {
      throw new Error('invalid password');
    }

    const cipher = crypto.createDecipheriv('aes-128-ctr', derivedLeftKey, normalized.iv);
    const privateKeyInBuffer = cipher.update(normalized.ciphertext);
    return addPrefix(privateKeyInBuffer.toString('hex'));
  }
}

export default KeyStore;
