import Struct from './codec/Struct';
import Vector from './codec/Vector';
import AccountId from './AccountId';

export class TrusteeIntentionProps extends Struct {
  static with(TrusteeAddress) {
    return Struct.with({
      trusteeList: Vector.with(AccountId),
      hotAddress: TrusteeAddress,
      coldAddress: TrusteeAddress,
    });
  }
}
