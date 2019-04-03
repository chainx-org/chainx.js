// Copyright 2017-2018 @polkadot/jsonrpc authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import createMethod from './create/method';

// NOTE order here is the same as in Rust, alphabetical below
const name = {
  description: 'Retrieves the node name',
  params: [],
  type: 'Text',
};

const version = {
  description: 'Retrieves the version of the node',
  params: [],
  type: 'Text',
};

const chain = {
  description: 'Retrieves the chain',
  params: [],
  type: 'Text',
};

const health = {
  description: '',
  params: [],
  type: 'RawJSON',
};

const peers = {
  description: '',
  params: [],
  type: 'RawJSON',
};

const properties = {
  description: 'Get a custom set of properties as a JSON object, defined in the chain spec',
  params: [],
  type: 'ChainProperties',
};

const section = 'system';

/**
 * @summary Methods to retrieve system info.
 */
export default {
  isDeprecated: false,
  isHidden: false,
  description: 'Methods to retrieve system info',
  section,
  methods: {
    chain: createMethod(section, 'chain', chain),
    name: createMethod(section, 'name', name),
    properties: createMethod(section, 'properties', properties),
    version: createMethod(section, 'version', version),
    health: createMethod(section, 'health', health),
    peers: createMethod(section, 'peers', peers),
  },
};
