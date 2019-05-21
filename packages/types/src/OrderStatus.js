import Enum from './codec/Enum';

export default class OrderType extends Enum {
  constructor(index) {
    super(['ZeroFill', 'ParitialFill', 'Filled', 'ParitialFillAndCanceled', 'Canceled'], index);
  }
}
