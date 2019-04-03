// Copyright 2017-2018 @polkadot/jsonrpc authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default function createParam(name, type, { isOptional = false } = { isOptional: false }) {
  return {
    isOptional,
    name,
    type,
  };
}
