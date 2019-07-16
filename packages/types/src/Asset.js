import Struct from './codec/Struct';

export class Asset extends Struct {
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
