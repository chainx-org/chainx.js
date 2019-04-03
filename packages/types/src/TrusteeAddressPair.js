import Struct from './codec/Struct';
import Bytes from './Bytes';

export default class TrusteeAddressPair extends Struct {
  constructor(value) {
    super(
      {
        hotAddress: Bytes,
        coldAddress: Bytes,
      },
      value
    );
  }
}
