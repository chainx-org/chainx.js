import Enum from './codec/Enum';

export default class AddrType extends Enum {
  constructor(index) {
    super(['Normal', 'Root', 'Trustee'], index);
  }
}
