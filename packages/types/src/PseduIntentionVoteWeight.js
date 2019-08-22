import Struct from './codec/Struct';
import U64 from './U64';
import BlockNumber from './BlockNumber';

/**
 * @name PseduIntentionVoteWeight
 * @description
 */
export default class PseduIntentionVoteWeight extends Struct {
  constructor(value) {
    super(
      {
        lastTotalDepositWeight: U64,
        lastTotalDepositWeightUpdate: BlockNumber,
      },
      value
    );
  }
}
