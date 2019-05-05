import TrusteeIntentionProps from './TrusteeIntentionProps';
import H520 from './H520';
import H264 from './H264';
import EnumType from './codec/EnumType';

class Normal extends H520 {}
class Compressed extends H264 {}

export default class BitcoinTrusteeType extends EnumType {
  constructor(value, index) {
    super(
      {
        Normal,
        Compressed,
      },
      value,
      index
    );
  }
}


export default TrusteeIntentionProps.with(BitcoinTrusteeType);
