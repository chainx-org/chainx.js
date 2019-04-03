import TxState from '../TxState';

describe('TxState', () => {
  it('哈哈哈哈哈', () => {
    expect(new TxState(Uint8Array.from([0x05, 0xe7, 0x03, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]))).toBeDefined();
  });
});
