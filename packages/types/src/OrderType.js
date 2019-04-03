import Enum from './codec/Enum';

export default class OrderType extends Enum {
  constructor(index) {
    super(['Limit', 'Market'], index);
  }
}
