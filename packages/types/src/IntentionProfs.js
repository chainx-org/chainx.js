import Struct from './codec/Struct';
import Bool from './Bool';
import Balance from './Balance';
import U32 from './U32';
import U64 from './U64';
import BlockNumber from './BlockNumber';
import Text from './Text';

/**
 * @name IntentionProfs
 * @description
 * https://github.com/chainpool/ChainX/blob/develop/cxrml/mining/staking/src/lib.rs#L90
 */
export default class IntentionProfs extends Struct {
  constructor(value) {
    super(
      {
        isActive: Bool,
        url: Text,
        name: Text,
        frozen: Balance,
        jackpot: Balance,
        activatorIndex: U32,
        totalNomination: Balance,
        lastTotalVoteWeight: U64,
        lastTotalVoteWeightUpdate: BlockNumber,
      },
      value
    );
  }
}
