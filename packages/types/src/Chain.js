import Enum from './codec/Enum';

export default class Chain extends Enum {
  constructor(index) {
    super(['ChainX', 'Bitcoin', 'Ethereum', 'Polkadot'], index);
  }

  // 发送交易
  toJSON() {
    return Object.keys(this._def)[this._index];
  }
}
