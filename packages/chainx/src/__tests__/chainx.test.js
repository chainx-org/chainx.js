import ApiBase from '../ApiBase';
import Chainx from '../index';
import { WsProvider } from '@chainx/rpc-provider';
import { Extrinsic } from '@chainx/types';
describe('chainx.js', () => {
  const chainx = new Chainx('ws://192.168.0.100:9944');

  jest.setTimeout(30000);

  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  it('test', async () => {
    console.log(chainx.api.tx.xAssets.transfer, 111);
    // console.log(chainx.api.tx.contract.putCode);
  });
});
