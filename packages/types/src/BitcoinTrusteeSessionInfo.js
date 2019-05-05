import TrusteeSessionInfo from './TrusteeSessionInfo';
import BitcoinAddress from './BitcoinAddress';
import Bytes from './Bytes';
import Struct from './codec/Struct';

class BitcoinTrusteeAddrInfo extends Struct {
  constructor(value) {
    super(
      {
        addr: BitcoinAddress,
        redeemScript: Bytes,
      },
      value
    );
  }
}

export default TrusteeSessionInfo.with(BitcoinTrusteeAddrInfo);
