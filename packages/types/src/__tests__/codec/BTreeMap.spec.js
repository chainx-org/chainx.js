// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { static as extrinsics } from '@chainx/extrinsics';
import createType from '../../codec/createType';
import Method from '../../Method';
import Text from '../../Text';
import Balance from '../../Balance';
import AssetType from '../../AssetType';
import Struct from '../../codec/Struct';
import BTreeMap from '../../codec/BTreeMap';

describe('BTreeMap', () => {
  const B1 = BTreeMap.with(
    Struct.with({
      assetType: AssetType,
      balance: Balance,
    })
  );
  it('BTreeMap', () => {
    expect(
      new B1([
        { assetType: 'Free', balance: 1973407743395 },
        { assetType: 'ReservedStaking', balance: 6480534409605 },
        { assetType: 'ReservedStakingRevocation', balance: 311000000 },
        { assetType: 'ReservedDexSpot', balance: 746847000 },
      ]).toHex()
    ).toBe('0x0400000000a37d4478cb010000018591f3dde405000002c07b8912000000000418fb832c00000000');
    expect(
      new B1([
        { assetType: 'Free', balance: 1973407743395 },
        { assetType: 'ReservedStaking', balance: 6480534409605 },
        { assetType: 'ReservedStakingRevocation', balance: 311000000 },
        { assetType: 'ReservedDexSpot', balance: 746847000 },
      ]).encodedLength
    ).toBe(40);
    expect(new B1('0x0400000000a37d4478cb010000018591f3dde405000002c07b8912000000000418fb832c00000000').toJSON()).toEqual([
      { assetType: 'Free', balance: 1973407743395 },
      { assetType: 'ReservedStaking', balance: 6480534409605 },
      { assetType: 'ReservedStakingRevocation', balance: 311000000 },
      { assetType: 'ReservedDexSpot', balance: 746847000 },
    ]);
  });
});
