import U8aFixed from './codec/U8aFixed';

export default class H264 extends U8aFixed {
  constructor(value) {
    super(value, 264);
  }
}
