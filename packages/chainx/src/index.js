import EventEmitter from 'eventemitter3';
import { WsProvider } from '@chainx/rpc-provider';
import Account, { NET_PREFIX } from '@chainx/account';
import { setAddressPrefix } from '@polkadot/keyring/address';

import ApiBase from './ApiBase';
import Stake from './Stake';
import Asset from './Asset';
import Chain from './Chain';
import Trade from './Trade';

class ChainX {
  constructor(wsUrlOrProvider = 'ws://127.0.0.1:8087', { net = 'testnet', broadcast = [] } = {}) {
    this.setNet(net);
    this._net = net;
    this._broadcast = broadcast;
    this._eventemitter = new EventEmitter();
    this.setProvider(wsUrlOrProvider, broadcast);
  }

  get net() {
    return this._net;
  }

  get broadcast() {
    return this._broadcast;
  }

  get api() {
    return this._api;
  }

  get provider() {
    return this._provider;
  }

  get account() {
    return Account;
  }

  get stake() {
    return this._stake;
  }

  get asset() {
    return this._asset;
  }

  get chain() {
    return this._chain;
  }

  get trade() {
    return this._trade;
  }

  setNet(net) {
    if (!net || !NET_PREFIX[net]) {
      throw new Error('expect pass in the network type, testnet or mainnet');
    }
    setAddressPrefix(NET_PREFIX[net]);
  }

  on(type, handler) {
    this._eventemitter.on(type, handler);
    return this;
  }

  once(type, handler) {
    this._eventemitter.once(type, handler);
    return this;
  }

  emit(type, ...args) {
    this._eventemitter.emit(type, ...args);
  }

  setProvider(wsUrlOrProvider, broadcast) {
    if (typeof wsUrlOrProvider === 'string') {
      this._provider = new WsProvider(wsUrlOrProvider);
    } else if (wsUrlOrProvider instanceof WsProvider) {
      this._provider = wsUrlOrProvider;
    } else {
      throw new Error('invalid parameter');
    }

    this._api = new ApiBase(this._provider, broadcast);

    this._stake = new Stake(this);
    this._asset = new Asset(this);
    this._chain = new Chain(this);
    this._trade = new Trade(this);

    this._api.on('disconnected', () => {
      this.emit('disconnected');
    });
    this._api.on('error', error => {
      this.emit('error', error);
    });
    this._api.on('connected', () => {
      this.emit('connected');
    });
    this._api.on('ready', () => {
      this.emit('ready');
    });
  }

  isRpcReady = () => {
    return this.api._isReady;
  };
}

export default ChainX;
