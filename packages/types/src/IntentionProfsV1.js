import Struct from './codec/Struct';
import Balance from './Balance';
import U128 from './U128';
import BlockNumber from './BlockNumber';

/**
 * @name IntentionProfsV1
 * @description
 */
export default class IntentionProfsV1 extends Struct {
  constructor(value) {
    super(
      {
        totalNomination: Balance,
        lastTotalVoteWeight: U128,
        lastTotalVoteWeightUpdate: BlockNumber,
      },
      value
    );
  }
}
