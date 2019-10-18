import Struct from './codec/Struct';
import Vec from './codec/Vec';
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
        ownerList: Vec.with(Tuple.with([AccountId, MultiSigPermission])),
      },
      value
    );
  }
}
