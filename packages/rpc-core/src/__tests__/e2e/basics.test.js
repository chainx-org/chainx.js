import Ws from '@chainx/rpc-provider/ws';

import Rpc from '../..';
import { static as storage } from '@chainx/storage';

const ALICE = '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ';

describe('e2e basics', () => {
  let api;

  beforeEach(() => {
    jest.setTimeout(30000);
    api = new Rpc(new Ws('ws://47.93.16.189:8082'));
  });

  it('retrieves the pending extrinsics', () => {
    return api.system
      .name()
      .then(name => {
        console.error('name', name);
      })
      .catch(error => {
        console.error(error);

        throw error;
      });
  });

  it('retrieves current timestamp', done => {
    let count = 0;
    console.error(storage.timestamp.now);
    return api.state
      .subscribeStorage([[storage.timestamp.now]], data => {
        expect(data).toBeDefined();

        if (++count === 3) {
          done();
        }
      })
      .then(subscriptionId => {
        // console.log('newHead: subscriptionId =', subscriptionId);
      });
  });

  it('retrieves balances', () => {
    return api.state
      .getStorage([storage.balances.freeBalance, ALICE])
      .then(balance => {
        console.error(balance);

        expect(balance.isZero()).not.toEqual(true);
      })
      .catch(error => {
        console.error(error);

        throw error;
      });
  });

  it.only('retrieves balances', () => {
    return api.state
      .getStorage([storage.staking.intentionProfiles, ALICE])
      .then(balance => {
        console.error(balance);

        expect(balance.isZero()).not.toEqual(true);
      })
      .catch(error => {
        console.error(error);

        throw error;
      });
  });
});
