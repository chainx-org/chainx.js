import Struct from './codec/Struct';
import Vec from './codec/Vec';
import AccountId from './AccountId';

export default class TrusteeIntentionProps extends Struct {
  static with(TrusteeAddress) {
    return Struct.with({
      trusteeList: Vec.with(AccountId),
      hotAddress: TrusteeAddress,
      coldAddress: TrusteeAddress,
    });
  }
}
