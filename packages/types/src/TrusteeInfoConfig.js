import Struct from './codec/Struct';
import U32 from './U32';

export default class TrusteeInfoConfig extends Struct {
  constructor(value) {
    super(
      {
        minTrusteeCount: U32,
        maxTrusteeCount: U32,
      },
      value
    );
  }
}
