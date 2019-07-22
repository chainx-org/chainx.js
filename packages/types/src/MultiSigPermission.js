import Enum from './codec/Enum';

export default class MultiSigPermission extends Enum {
  constructor(index) {
    super(['ConfirmOnly', 'ConfirmAndPropose'], index);
  }
}
