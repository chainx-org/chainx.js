// Copyright 2017-2018 @polkadot/api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Extrinsic } from '@chainx/types';
import Account from '@chainx/account';
import { ConfigSet } from 'ts-jest/dist/config/config-set';

export default class SubmittableExtrinsic extends Extrinsic {
  constructor(api, extrinsic, broadcast) {
    super(extrinsic);
    this._api = api;
    this._broadcast = broadcast;
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
          // blockHash = status.value;
          // const {
          //   block: { extrinsics },
          // } = await this._api.rpc.chain.getBlock(blockHash);
          // const allEvents = await this._api.query.system.events.at(blockHash);
          // index = extrinsics.map(ext => ext.hash.toHex()).indexOf(this.hash.toHex());
          // if (index !== -1) {
          //   events = allEvents.filter(({ phase }) => phase.type === 'ApplyExtrinsic' && phase.value.eqn(index));
          //   result = events.length ? events[events.length - 1].event.data.method : eventName;
          // }
        }
        statusCb(null, {
          result,
          index,
          events: events && events.map(event => event.toJSON()),
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
      noncePromise = this._api.query.system.accountNonce(address);
    } else {
      noncePromise = Promise.resolve(nonce);
    }
    return noncePromise
      .then(nonce => {
        const extrinsic = new Extrinsic({ method: this.method.toHex() });
        extrinsic.sign(Account.from(' '), nonce, acceleration, blockHash);
        return this._api.rpc.chainx.getFeeByCallAndLength(this.method.toHex(), extrinsic.toU8a().length);
      })
      .then(data => {
        return acceleration * data;
      });
  }

  signAndSend(_signerPair, _options, callback) {
    let options = {};
    let signerPair;

    if (typeof _options === 'function') {
      callback = _options;
    } else {
      options = _options || {};
    }

    if (typeof _signerPair === 'object' && _signerPair instanceof Account) {
      signerPair = _signerPair;
    } else {
      signerPair = Account.from(_signerPair);
    }

    let noncePromise;
    if (!options.nonce) {
      noncePromise = this._api.query.system.accountNonce(signerPair.publicKey());
    } else {
      noncePromise = Promise.resolve(options.nonce);
    }

    noncePromise
      .then(nonce => {
        const submittableExtrinsic = this.sign(signerPair, { ...options, nonce });
        submittableExtrinsic.send(callback);
      })
      .catch(callback);
  }

  send(statusCb) {
    if (!statusCb || !this._api.hasSubscriptions) {
      return this._api.rpc.author.submitExtrinsic(this);
    }
    try {
      this.submitBroadcast();
    } catch {}
    return this._api.rpc.author.submitAndWatchExtrinsic(this, this.checkStatus(statusCb));
  }

  submitBroadcast(params) {
    if (!this._broadcast.length) return;
    const id = Math.random();
    const requireMessage = `{"id":5,"jsonrpc":"2.0","method":"author_submitExtrinsic","params":[${params}]}`;
    const fromHttp = httpurl => {
      return fetch(httpurl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: requireMessage,
      }).then(r => r.json());
    };

    const fromWs = wsurl => {
      return new Promise((resolve, reject) => {
        const ws = new WebSocket(wsurl);
        ws.onmessage = m => {
          try {
            const data = JSON.parse(m.data);
            if (data.id === id) f;
            resolve(data);
            ws.close();
          } catch (err) {
            reject(err);
          }
        };
        ws.onopen = () => {
          ws.send(requireMessage);
        };
      });
    };

    for (const url of this._broadcast) {
      const isHttp = /^(http:\/\/|https:\/\/)/.test(url);

      if (isHttp) {
        fromHttp(url);
      } else {
        fromWs(url);
      }
    }
  }

  sign(signerPair, { nonce, acceleration = 1, blockHash = this._api.genesisHash } = {}) {
    super.sign(signerPair, nonce, acceleration, blockHash);
    return this;
  }
}
