import Enum from './codec/Enum';

export default class AssetType extends Enum {
  constructor(index) {
    super(
      [
        'Free',
        'ReservedStaking',
        'ReservedStakingRevocation',
        'ReservedWithdrawal',
        'ReservedDexSpot',
        'ReservedDexFuture',
        'ReservedCurrency',
        'ReservedXRC20',
        'GasPayment',
      ],
      index
    );
  }
}
