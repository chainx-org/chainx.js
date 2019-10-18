// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { getTypeRegistry } from './codec/create';
import * as definitions from './interfaces/definitions';
import * as baseTypes from './index.types';

import { BTreeMap, Compact, Enum, Option, Result, Set, Struct, Tuple, Vec, U8a, UInt } from './codec';

/**
 * @description A utility method that injects all the srml definitions into the type registry
 */
export function injectTypes() {
  const registry = getTypeRegistry();
  // since these are classes, the are active immediately
  registry.register({ ...baseTypes });
  // since these are definitions, they would only get created when needed
  Object.values(definitions).forEach(({ types }) => registry.register(types));

  [BTreeMap, Compact, Enum, Option, Result, Set, Struct, Tuple, Vec, U8a, UInt].forEach(type =>
    registry.register(type)
  );
}

injectTypes();
