// Copyright 2017-2018 @polkadot/storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import * as substrate from './substrate';

const storage = {
  substrate, // Prefill storage with well known keys, as not returned by state_getMetadata
};

export default storage;
