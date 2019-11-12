import Enum from './codec/Enum';

export default class ERC20Selector extends Enum {
  constructor(index) {
    super(['BalanceOf', 'TotalSupply', 'Name', 'Symbol', 'Decimals', 'Issue', 'Destory'], index);
  }
}
