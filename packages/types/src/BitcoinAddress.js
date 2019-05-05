import U8aFixed from './codec/U8aFixed';
import Struct from './codec/Struct';
import Enum from './codec/Enum';

class Type extends Enum {
  constructor(index) {
    super(['P2PKH', 'P2SH'], index);
  }
}

class Network extends Enum {
  constructor(index) {
    super(['Mainnet', 'Testnet'], index);
  }
}

class AddressHash extends U8aFixed {
  constructor(value) {
    super(value, 160);
  }
}

export default class BitcoinAddress extends Struct {
  constructor(value) {
    super(
      {
        kind: Type,
        network: Network,
        hash: AddressHash,
      },
      value
    );
  }
}
