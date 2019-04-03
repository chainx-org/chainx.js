import Enum from './codec/Enum';

export default class OrderType extends Enum {
  constructor(index) {
    super(['ZeroExecuted', 'ParitialExecuted', 'AllExecuted', 'ParitialExecutedAndCanceled', 'Canceled'], index);
  }
}
