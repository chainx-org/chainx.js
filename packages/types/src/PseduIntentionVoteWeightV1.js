import Struct from './codec/Struct';
import U128 from './U128';
import BlockNumber from './BlockNumber';

/**
 * @name PseduIntentionVoteWeightV1
 * @description
 */
export default class PseduIntentionVoteWeightV1 extends Struct {
  constructor(value) {
    super(
      {
        lastTotalDepositWeight: U128,
        lastTotalDepositWeightUpdate: BlockNumber,
      },
      value
    );
  }
}
