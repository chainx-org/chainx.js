import Struct from './codec/Struct';
import Balance from './Balance';
import U64 from './U64';
import BlockNumber from './BlockNumber';

/**
 * @name IntentionProfs
 * @description
 */
export default class IntentionProfs extends Struct {
  constructor(value) {
    super(
      {
        totalNomination: Balance,
        lastTotalVoteWeight: U64,
        lastTotalVoteWeightUpdate: BlockNumber,
      },
      value
    );
  }
}
