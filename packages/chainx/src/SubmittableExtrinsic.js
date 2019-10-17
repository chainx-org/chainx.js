// Copyright 2017-2018 @polkadot/api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Extrinsic } from '@chainx/types';
import Account from '@chainx/account';
import { WsProvider, HttpProvider } from '@chainx/rpc-provider';

const IMMORTAL_ERA = new Uint8Array([0]);

export default class SubmittableExtrinsic extends Extrinsic {
  constructor(api, extrinsic, broadcasts) {
    super(extrinsic);
    this._api = api;
    this._broadcasts = broadcasts;
  }

  checkStatus(statusCb) {
    return async (error, status) => {
      if (error) return statusCb(error);
      try {
        let events = null;
        let result = null;
        let index = null;
        let blockHash = null;
        let broadcast = null;
        if (status.type === 'Broadcast') {
          broadcast = status.value && status.value.toJSON();
        }
        if (status.type === 'Finalized') {
          blockHash = status.value;
          const {
            block: { extrinsics },
          } = await this._api.rpc.chain.getBlock(blockHash);
          const allEvents = await this._api.query.system.events.at(blockHash);
          index = extrinsics.map(ext => ext.hash.toHex()).indexOf(this.hash.toHex());
          if (index !== -1) {
            events = allEvents.filter(({ phase }) => phase.type === 'ApplyExtrinsic' && phase.value.eqn(index));
            result = events.length ? events[events.length - 1].event.data.method : '';
          }
        }
        statusCb(null, {
          result,
          index,
          events:
            events &&
            events.map(event => {
              const o = event.toJSON();
              o.method = event.event.data.method;
              return o;
            }),
          txHash: this.hash.toHex(),
          blockHash: blockHash && blockHash.toJSON(),
          broadcast: broadcast,
          status: status.type,
        });
      } catch (err) {
        statusCb(err);
      }
    };
  }

  getFee(address, { nonce, acceleration = 1, blockHash = this._api.genesisHash } = {}) {
    let noncePromise;
    if (!nonce) {
      noncePromise = this.getNonce(address);
    } else {
      noncePromise = Promise.resolve(nonce);
    }
    return noncePromise
      .then(nonce => {
        const extrinsic = new Extrinsic({ method: this.method.toHex() });
        extrinsic.sign(Account.from(' '), nonce, acceleration, blockHash);
        try {
          return this.getFeeSync({ nonce: nonce.toNumber() });
        } catch {
          return this._api.rpc.chainx.getFeeByCallAndLength(this.method.toHex(), extrinsic.toU8a().length);
        }
      })
      .then(data => {
        return acceleration * data;
      });
  }

  getFeeSync({ nonce = 1, acceleration = 1, blockHash = this._api.genesisHash } = {}) {
    if (!this._api.feeWeight) {
      throw new Error('need fee map');
    }
    const feeWeightMap = Object.keys(this._api.feeWeight.feeWeight).reduce((r, k) => {
      const key = k.toLowerCase().replace(/[\W_]/g, '');
      r[key] = this._api.feeWeight.feeWeight[k];
      if (key.includes('xassetsprocess')) {
        r[key.replace('xassetsprocess', 'withdrawal')] = this._api.feeWeight.feeWeight[k];
      }
      return r;
    }, {});

    const baseFee = this._api.feeWeight.transactionBaseFee;
    const byteFee = this._api.feeWeight.transactionByteFee;

    const methodName = this.method
      .toJSON()
      .methodName.toLowerCase()
      .replace(/[\W_]/g, '');

    const weight = feeWeightMap[methodName];

    const extrinsic = new Extrinsic({ method: this.method.toHex() });

    extrinsic.sign(Account.from(' '), nonce, acceleration, blockHash);

    return (baseFee * weight + byteFee * extrinsic.toU8a().length) * acceleration;
  }

  getNonce(address) {
    return this._api.query.system.accountNonce(address);
  }

  signAndSend(_signerPair, _options, callback) {
    let options = {};
    let signerPair;

    if (typeof _options === 'function') {
      callback = _options;
    } else {
      options = _options || {};
    }

    if (typeof _signerPair === 'object' && typeof _signerPair.sign === 'function') {
      signerPair = _signerPair;
    } else {
      signerPair = Account.from(_signerPair);
    }

    let noncePromise;
    if (!options.nonce) {
      noncePromise = this.getNonce(signerPair.publicKey());
    } else {
      noncePromise = Promise.resolve(options.nonce);
    }

    return noncePromise
      .then(nonce => {
        const submittableExtrinsic = this.sign(signerPair, { ...options, nonce });
        return submittableExtrinsic.send(callback);
      })
      .catch(callback);
  }

  async send(statusCb) {
    let promise;
    if (!statusCb || !this._api.hasSubscriptions) {
      promise = this._api.rpc.author.submitExtrinsic(this);
      this.submitBroadcast();
    } else {
      promise = this._api.rpc.author.submitAndWatchExtrinsic(this, this.checkStatus(statusCb));
      this.submitBroadcast();
    }
    await promise;
    return this.hash.toHex();
  }

  submitBroadcast() {
    try {
      if (!this._broadcasts.length) return;
      const fromHttp = httpurl => {
        const httpSend = new HttpProvider(httpurl);
        return httpSend.send('author_submitExtrinsic', [this.toHex()]);
      };

      const fromWs = wsurl => {
        const wsSend = new WsProvider(wsurl);
        return wsSend.send('author_submitExtrinsic', [this.toHex()], data => {
          wsSend.disconnect();
        });
      };

      for (const url of this._broadcasts) {
        const isHttp = /^(http:\/\/|https:\/\/)/.test(url);

        if (isHttp) {
          fromHttp(url);
        } else {
          fromWs(url);
        }
      }
    } catch (err) {}
  }

  sign(_signerPair, { nonce, acceleration = 1, blockHash = this._api.genesisHash, era } = {}) {
    let signerPair;
    if (typeof _signerPair === 'object' && typeof _signerPair.sign === 'function') {
      signerPair = _signerPair;
    } else {
      signerPair = Account.from(_signerPair);
    }
    super.sign(signerPair, nonce, acceleration, blockHash);
    return this;
  }

  encodeMessage(address, { nonce, acceleration = 1, blockHash = this._api.genesisHash, era = IMMORTAL_ERA } = {}) {
    return super.encodeMessage(address, nonce, acceleration, blockHash, era);
  }

  appendSignature(signature) {
    this.signature.appendSignature(signature);

    return this;
  }
}
