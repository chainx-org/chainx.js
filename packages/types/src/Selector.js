import U8aFixed from './codec/U8aFixed';

export default class Selector extends U8aFixed {
  constructor(value) {
    super(value, 32);
  }
}
