import TrusteeIntentionProps from './TrusteeIntentionProps';
import H520 from './H520';
import H264 from './H264';
import Enum from './codec/Enum';

class Normal extends H520 {}
class Compressed extends H264 {}

class BitcoinTrusteeType extends Enum {
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
