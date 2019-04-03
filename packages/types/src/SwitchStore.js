import Struct from './codec/Struct';
import Bool from './Bool';

export default class SwitchStore extends Struct {
  constructor(value) {
    super(
      {
        global: Bool,
        spot: Bool,
        xbtc: Bool,
        sdot: Bool,
      },
      value
    );
  }
}
