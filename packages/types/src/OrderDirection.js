import Enum from './codec/Enum';

export default class OrderDirection extends Enum {
  constructor(index) {
    super(['Buy', 'Sell'], index);
  }
}
