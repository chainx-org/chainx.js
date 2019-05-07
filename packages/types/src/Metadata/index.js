// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { default as Metadata } from './Metadata';
import * as v0S from './v0/Storage';
import * as v4S from './v4/Storage';

export default Metadata;

export const v0SPlainType = v0S.PlainType;
export const v0SStorageFunctionMetadata = v0S.StorageFunctionMetadata;
export const v0SStorageFunctionModifier = v0S.StorageFunctionModifier;
export const v0SStorageFunctionType = v0S.StorageFunctionType;
export const v4SPlainType = v4S.PlainType;
export const v4SStorageFunctionMetadata = v4S.StorageFunctionMetadata;
export const v4SStorageFunctionModifier = v4S.StorageFunctionModifier;
export const v4SStorageFunctionType = v4S.StorageFunctionType;
