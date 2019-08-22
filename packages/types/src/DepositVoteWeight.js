import Struct from './codec/Struct';
import U64 from './U64';
import BlockNumber from './BlockNumber';

/**
 * @name DepositVoteWeight
 * @description
 */
export default class DepositVoteWeight extends Struct {
  constructor(value) {
    super(
      {
        lastDepositWeight: U64,
        lastDepositWeightUpdate: BlockNumber,
      },
      value
    );
  }
}
