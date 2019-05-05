import Struct from './codec/Struct';
import Text from './Text';

export class TrusteeIntentionProps extends Struct {
  static with(TrusteeEntity) {
    return Struct.with({
      about: Text,
      hotEntity: TrusteeEntity,
      coldEntity: TrusteeEntity,
    });
  }
}
