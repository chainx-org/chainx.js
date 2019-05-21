import Enum from './codec/Enum';

export default class OrderStatus extends Enum {
  constructor(index) {
    super(['ZeroFill', 'ParitialFill', 'Filled', 'ParitialFillAndCanceled', 'Canceled'], index);
  }
}
