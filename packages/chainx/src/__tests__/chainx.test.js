import ApiBase from '../ApiBase';
import Chainx from '../index';
import { WsProvider } from '@chainx/rpc-provider';
import { Extrinsic } from '@chainx/types';
describe('chainx.js', () => {
  // const
  // const chainx = new ApiBase(new WsProvider('wss://w1.chainx.org/ws'));
  const chainx = new Chainx('ws://39.96.178.97:8087');

  jest.setTimeout(30000);

  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  it('test', async done => {
    const accounts = await chainx.chain.particularAccounts();
    console.error(accounts);
    const multiSigAddrInfo = await chainx.trustee.getMultiSigAddrInfo(accounts.trusteesAccount.Bitcoin);
    console.error(multiSigAddrInfo);
    const pendingListFor = await chainx.trustee.getPendingListFor(accounts.trusteesAccount.Bitcoin);
    console.error(JSON.stringify(pendingListFor));
  });
});
