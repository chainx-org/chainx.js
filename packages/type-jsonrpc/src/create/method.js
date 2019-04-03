// Copyright 2017-2018 @polkadot/jsonrpc authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default function createMethod(
  section,
  method,
  { description, isDeprecated = false, isHidden = false, isSigned = false, params, pubsub, type }
) {
  return {
    description,
    isDeprecated,
    isHidden,
    isSigned,
    isSubscription: !!pubsub,
    method,
    params,
    pubsub: pubsub || ['', '', ''],
    section,
    type,
  };
}
