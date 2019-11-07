import Enum from './codec/Enum';

export default class CallSwitcher extends Enum {
  constructor(index) {
    super(['Global', 'Spot', 'XBTC', 'XBTCLockup', 'SDOT', 'XContracts'], index);
  }
}
