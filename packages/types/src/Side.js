import Enum from './codec/Enum';

export default class Side extends Enum {
  constructor(index) {
    super(['Buy', 'Sell'], index);
  }
}
