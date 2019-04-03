// Copyright 2017-2018 @polkadot/extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Extrinsic } from '@chainx/types';
import testingPairs from '@polkadot/keyring/testingPairs';
import { hexToU8a } from '@polkadot/util';

import extrinsics from '../static';
const keyring = testingPairs();
describe.skip('extrinsics', () => {
  it('encodes extrinsic correctly (nobody)', () => {
    expect(
      new Extrinsic({
        method: extrinsics.timestamp.set(10101),
      })
        .sign(keyring.nobody, 1234, 0, new Uint8Array())
        .toU8a(true)
    ).toEqual(
      new Uint8Array([
        // version
        0x81,
        // prefix
        0xff,
        // publicKey
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        // signature
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        // account nonce
        210,
        4,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        // era
        0,
        // call index
        0,
        0,
        // values
        0,
        0,
        0,
        213,
        157,
      ])
    );
  });
  it('encodes an actual transfer (actual data)', () => {
    expect(
      new Extrinsic({
        method: extrinsics.xassets.transfer(keyring.bob.publicKey(), 'PCX', 6969, 'abcd'),
      })
        .sign(keyring.alice, 0, 1, '0xec7afaf1cca720ce88c1d1b689d81f0583cc15a97d621cf046dd9abf605ef22f')
        .toU8a()
    ).toEqual(
      // 8d0281ffd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4fd5130749bb4fc46ecd9c655db8c83556effb50a7080cda939eeb749473f1878c909642c3aefa27c094075f306d2800515e9d7ad5d4a7df136479f721628f020e000000000000000000010000000603ffd7568e5f0a7eda67a82691ff379ac4bba4f9c9b859fe779b5d46363b61ad2db90c504358391b0000000000001061626364
      hexToU8a(
        '0x' +
          // length
          '8d02' +
          // version
          '81' +
          // prefix + alice's publicKey
          'ffd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f' +
          // signature
          'd5130749bb4fc46ecd9c655db8c83556effb50a7080cda939eeb749473f1878c' +
          '909642c3aefa27c094075f306d2800515e9d7ad5d4a7df136479f721628f020e' +
          // nonce
          '0000000000000000' +
          // era
          '00' +
          // acceleration
          '01000000' +
          // call index
          '0603' +
          // prefix + bob's publicKey
          'ffd7568e5f0a7eda67a82691ff379ac4bba4f9c9b859fe779b5d46363b61ad2db9' +
          '0c504358391b0000000000001061626364'
      )
    );
  });
});
