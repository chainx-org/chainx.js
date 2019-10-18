import Struct from './codec/Struct';
import Vec from './codec/Vec';
import Tuple from './codec/Tuple';
import Balance from './Balance';
import BlockNumber from './BlockNumber';
import MultiSigPermission from './MultiSigPermission';
import U128 from './U128';

/**
 * @name NominationRecordV1
 * @description
 */
export default class NominationRecordV1 extends Struct {
  constructor(value) {
    super(
      {
        nomination: Balance,
        lastVoteWeight: U128,
        lastVoteWeightUpdate: BlockNumber,
        revocations: Vec.with(Tuple.with([AccountId, MultiSigPermission])),
      },
      value
    );
  }
}
