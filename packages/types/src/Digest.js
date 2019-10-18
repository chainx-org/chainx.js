// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Enum from './codec/Enum';
import Struct from './codec/Struct';
import Tuple from './codec/Tuple';
import Vec from './codec/Vec';
import AuthorityId from './AuthorityId';
import Bytes from './Bytes';
import Hash from './Hash';
import Signature from './Signature';
import U64 from './U64';
/**
 * @name AuthoritiesChange
 * @description
 * Log for Authories changed
 */
export class AuthoritiesChange extends Vec.with(AuthorityId) {}
/**
 * @name ChangesTrieRoot
 * @description
 * Log for changes to the Trie root
 */
export class ChangesTrieRoot extends Hash {}
/**
 * @name Other
 * @description
 * Log item that is just a stream of [[Bytes]]
 */
export class Other extends Bytes {}
/**
 * @name Seal
 * @description
 * Log item indicating a sealing event
 */
export class Seal extends Tuple {
  constructor(value) {
    super([U64, Signature], value);
  }
  /**
   * @description The wrapped [[Signature]]
   */
  get signature() {
    return this[1];
  }
  /**
   * @description The wrapped [[U64]] slot
   */
  get slot() {
    return this[0];
  }
}
/**
 * @name DigestItem
 * @description
 * A [[Enum]] the specifies the specific item in the logs of a [[Digest]]
 */
export class DigestItem extends Enum {
  constructor(value) {
    super(
      {
        Other,
        AuthoritiesChange,
        ChangesTrieRoot,
        Seal,
      },
      value
    );
  }
}
/**
 * @name Digest
 * @description
 * A [[Header]] Digest
 */
export default class Digest extends Struct {
  constructor(value) {
    // @todo digest 解析有错误
    super(
      {
        // logs: Vec.with(Text),
      },
      value
    );
  }
  /**
   * @description The [[DigestItem]] logs
   */
  get logs() {
    return this.get('logs');
  }
}
