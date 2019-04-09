import ChainX from '../index';

describe('chainx.js', () => {
  const chainx = new ChainX('ws://192.168.1.222:8097');
  jest.setTimeout(30000);
  beforeEach(async () => {
    await chainx.isRpcReady();
  });
});
