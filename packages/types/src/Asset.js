import Struct from './codec/Struct';
import Token from './Token';
import Chain from './Chain';
import Precision from './Precision';
import Desc from './Desc';

export default class Asset extends Struct {
  constructor(value) {
    super(
      {
        token: Token,
        token_name: Token,
        chain: Chain,
        precision: Precision,
        desc: Desc,
      },
      value
    );
  }
}
