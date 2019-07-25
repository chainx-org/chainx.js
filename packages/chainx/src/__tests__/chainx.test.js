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
    // const e = chainx.trustee.removeMultiSigFor(
    //   '0xb106fb4dc17f3e7671a1aed77c5fdf0f83dbc47793a50bc2dd115587640e641e', // 地址
    //   '0xe1b9ba50f7bc98a5094dcef1dcc1709155d3274c492b6638beeff78d29b12d9f' // proposal id
    // );

    // const e = chainx.trustee.execute(
    //   '0xb106fb4dc17f3e7671a1aed77c5fdf0f83dbc47793a50bc2dd115587640e641e',
    //   chainx.api.tx.xBridgeFeatures.transitionTrusteeSession('Bitcoin', [
    //     '5FjN2LCaoRfCR6Z78XHBE6SMCUPFPRWQD7bHU5M8qxrhTxjj',
    //     '5ELXHYwfbNmovjN1BwFZaGJBczAuTuBdzNBSU4bUWLz6cvW3',
    //     '5E24tsypCtNAoHuC6UVfrKNkcHQmPzKRuLaNLgAWAig3KtCa',
    //   ])
    // );

    // e.signAndSend('0x436861696e582d416c6963652020202020202020202020202020202020202020', (error, response) => {
    //   if (error) {
    //     console.log(error);
    //   } else if (response.status === 'Finalized') {
    //     if (response.result === 'ExtrinsicSuccess') {
    //       console.log('交易成功');
    //     }
    //   }
    // });
  });
});
