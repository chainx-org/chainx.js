import Enum from './codec/Enum';

export default class ERC20Selector extends Enum {
  constructor(index) {
    super(['Issue', 'BalanceOf', 'TotalSupply', 'Name', 'Symbol', 'Decimals'], index);
  }
}
