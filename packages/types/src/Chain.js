import Enum from './codec/Enum';

export default class Chain extends Enum {
  constructor(index) {
    super(['ChainX', 'Bitcoin', 'Ethereum', 'Polkadot'], index);
  }
}
