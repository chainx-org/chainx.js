// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import MetadataV3 from '../v3/Metadata';
export default function toV3(v4) {
  return new MetadataV3(v4);
}
