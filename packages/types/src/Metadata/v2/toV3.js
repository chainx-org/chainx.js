// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import MetadataV3 from '../v3';
export default function toV3(metadataV2) {
  return new MetadataV3(metadataV2);
}
