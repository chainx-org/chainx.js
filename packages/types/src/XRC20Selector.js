import Enum from './codec/Enum';

export default class XRC20Selector extends Enum {
  constructor(index) {
    super(['BalanceOf', 'TotalSupply', 'Name', 'Symbol', 'Decimals', 'Issue', 'Destroy'], index);
  }
}
