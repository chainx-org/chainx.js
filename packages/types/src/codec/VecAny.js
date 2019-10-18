import AbstractArray from './AbstractArray';

export default class VecAny extends AbstractArray {
  toRawType() {
    return 'Vec<Codec>';
  }
}
