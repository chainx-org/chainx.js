// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import MetadataV5 from '../v5';
/**
 * @description Convert from MetadataV8 to a stripped representation of MetadataV8
 */
export default function toCallsOnly({ modules }) {
  return new MetadataV5({
    // FIXME, this needs typing, not any
    modules: modules.map(({ calls, name }) => ({
      name,
      calls,
    })),
  }).toJSON();
}
