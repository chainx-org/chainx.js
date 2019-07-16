import Enum from './codec/Enum';

export default class AssetLimit extends Enum {
  constructor(index) {
    super(['CanMove', 'CanTransfer', 'CanDeposit', 'CanWithdraw', 'CanDestroyWithdrawal', 'CanDestroyFree'], index);
  }
}
