import Token from './Token';
import Struct from './codec/Struct';

export default class CurrencyPair extends Struct {
  constructor(value) {
    super(
      {
        first: Token,
        second: Token,
      },
      value
    );
  }
}
