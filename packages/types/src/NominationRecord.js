import Struct from './codec/Struct';
import Vector from './codec/Vector';
import Tuple from './codec/Tuple';
import Balance from './Balance';
import BlockNumber from './BlockNumber';
import MultiSigPermission from './MultiSigPermission';
import U64 from './U64';

/**
 * @name NominationRecord
 * @description
 */
export default class NominationRecord extends Struct {
  constructor(value) {
    super(
      {
        nomination: Balance,
        lastVoteWeight: U64,
        lastVoteWeightUpdate: BlockNumber,
        revocations: Vector.with(Tuple.with([AccountId, MultiSigPermission])),
      },
      value
    );
  }
}
