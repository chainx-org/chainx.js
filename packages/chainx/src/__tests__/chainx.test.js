import ApiBase from '../ApiBase';
import Chainx from '../index';
import { WsProvider } from '@chainx/rpc-provider';
import { Extrinsic } from '@chainx/types';
describe('chainx.js', () => {
  const chainx = new Chainx('wss://w1.chainx.org.cn/ws');

  jest.setTimeout(30000);

  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  it('test', async () => {
    const accounts = await chainx.chain.particularAccounts();
    console.debug(accounts);
    const multiSigAddrInfo = await chainx.trustee.getMultiSigAddrInfo(accounts.trusteesAccount.Bitcoin);
    console.debug(multiSigAddrInfo);
    const pendingListFor = await chainx.trustee.getPendingListFor(accounts.trusteesAccount.Bitcoin);
    console.debug(JSON.stringify(pendingListFor));
  });
});
