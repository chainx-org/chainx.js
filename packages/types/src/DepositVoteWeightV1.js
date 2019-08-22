import Struct from './codec/Struct';
import U128 from './U128';
import BlockNumber from './BlockNumber';

/**
 * @name DepositVoteWeightV1
 * @description
 */
export default class DepositVoteWeightV1 extends Struct {
  constructor(value) {
    super(
      {
        lastDepositWeight: U128,
        lastDepositWeightUpdate: BlockNumber,
      },
      value
    );
  }
}
