import Bytes from './Bytes';
import Enum from './codec/Enum';
import Tuple from './codec/Tuple';
import { u8aConcat } from '@polkadot/util';

// 目前只有 Bitcoin
export class TrusteeEntityType extends Enum {
  constructor(index) {
    super(['Bitcoin'], index);
  }
}

export default class TrusteeEntity extends Tuple {
  constructor(value) {
    super([TrusteeEntityType, Bytes], value);
  }
}
