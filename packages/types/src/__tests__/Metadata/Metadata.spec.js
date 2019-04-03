// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Metadata from '../../Metadata/index';
import latestParsed from './latest.substrate.json';
import rpcData from '../../Metadata/static';

describe('Metadata', () => {
  it('decodes latest properly', () => {
    const decoded = new Metadata(rpcData);
    const jsonData = JSON.stringify(decoded.toJSON(), null, 2);
    console.log(jsonData);
  });
});
