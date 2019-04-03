// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Struct from './codec/Struct';
import Tuple from './codec/Tuple';
import Vector from './codec/Vector';
import BlockNumber from './BlockNumber';
import SessionKey from './SessionKey';
import U64 from './U64';
/**
 * @name NextAuthority
 * @description
 * The next authority available as [[SessionKey]]
 */
export class NextAuthority extends Tuple {
  constructor(value) {
    super([SessionKey, U64], value);
  }
  get index() {
    return this[1];
  }
  get sessionKey() {
    return this[0];
  }
}
/**
 * @name StoredPendingChange
 * @description
 * Stored pending change for a Grandpa events
 */
export default class StoredPendingChange extends Struct {
  constructor(value) {
    super(
      {
        scheduledAt: BlockNumber,
        delay: BlockNumber,
        nextAuthorities: Vector.with(NextAuthority),
      },
      value,
      new Map([['scheduledAt', 'scheduled_at'], ['nextAuthorities', 'next_authorities']])
    );
  }
  get delay() {
    return this.get('delay');
  }
  get nextAuthorities() {
    return this.get('nextAuthorities');
  }
  get scheduledAt() {
    return this.get('scheduledAt');
  }
}
