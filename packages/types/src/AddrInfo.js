import Struct from './codec/Struct';
import Vector from './codec/Vector';
import Tuple from './codec/Tuple';
import AddrType from './AddrType';
import U32 from './U32';
import AccountId from './AccountId';
import MultiSigPermission from './MultiSigPermission';

export default class AddrInfo extends Struct {
  constructor(value) {
    super(
      {
        addrType: AddrType,
        requiredNum: U32,
        ownerList: Vector.with(Tuple.with([AccountId, MultiSigPermission])),
      },
      value
    );
  }
}
