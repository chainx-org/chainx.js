import U8aFixed from './codec/U8aFixed';

export default class EthereumAddress extends U8aFixed {
  constructor(value) {
    super(value, 160);
  }
}
