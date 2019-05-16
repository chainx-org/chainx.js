import Struct from './codec/Struct';
import H256 from './H256';
import I8 from './I8';

export default class EcdsaSignature extends Struct {
  constructor(value) {
    super(
      {
        r: H256,
        s: H256,
        v: I8,
      },
      value
    );
  }
}
