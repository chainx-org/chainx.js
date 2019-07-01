import ApiBase from '../ApiBase';
import Chainx from '../index';
import { WsProvider } from '@chainx/rpc-provider';
import { Extrinsic } from '@chainx/types';
describe('chainx.js', () => {
  // const
  // const chainx = new ApiBase(new WsProvider('wss://w1.chainx.org/ws'));
  const chainx = new Chainx('wss://w1.chainx.org/ws');

  jest.setTimeout(30000);

  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  it('test', done => {
    // const subcription = chainx.query$.xAssets
    //   .assetBalance(['5QezaXNmyBubyHVBVuwq3ET34P1fWmi57WX7VDNFa5HFm1hm', 'PCX'])
    //   .subscribe(balance => {
    //     console.error(balance.toJSON());
    //   });

    // const data = chainx.query.xAssets.assetBalance
    //   .at('0x7b0635300b80446b16d4cb78ae6cb8b6150506ad0e5627406d3152b73427db4a', [
    //     '5QezaXNmyBubyHVBVuwq3ET34P1fWmi57WX7VDNFa5HFm1hm',
    //     'PCX',
    //   ])
    //   .then(balance => {
    //     console.error(balance.toJSON());
    //   });
    chainx.chain.subscribeNewHead().subscribe(data => {
      console.log(data);
    });
  });
});
