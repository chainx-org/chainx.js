// Copyright 2017-2018 @polkadot/rpc-core authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Ws from '@chainx/rpc-provider/ws';
import { static as storage } from '@chainx/storage';

import Rpc from '../..';

describe.skip('e2e subscriptions', () => {
  let api;

  beforeEach(() => {
    jest.setTimeout(30000);
    api = new Rpc(new Ws('ws://127.0.0.1:9944'));
  });

  it('retrieves current timestamp', done => {
    let count = 0;

    return api.state
      .subscribeStorage([[storage.timestamp.now]], data => {
        expect(data).toBeDefined();

        if (++count === 3) {
          done();
        }
      })
      .then(subscriptionId => {
        console.log('newHead: subscriptionId =', subscriptionId);
      });
  });
});
