// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Enum from './codec/Enum';
import Struct from './codec/Struct';
import AuthorityId from './AuthorityId';
import { BftHashSignature } from './Bft';
import BlockNumber from './BlockNumber';
import Hash from './Hash';
import U32 from './U32';
/**
 * @name BftAtReport
 * @description
 * A report of a/b hash-signature pairs for a specific index. This is the same
 * structure as is used in BftDoublePrepare & BftDoubleCommit
 */
// FIXME It is not entirely obvious from the actual Rust code what the specific
// items in the structure is called, except a & b (one should be expected, the
// other actual)
export class BftAtReport extends Struct {
  constructor(value) {
    super(
      {
        round: U32,
        a: BftHashSignature,
        b: BftHashSignature,
      },
      value
    );
  }
  /**
   * @description The first report [[BftHashSignature]]
   */
  get a() {
    return this.get('a');
  }
  /**
   * @description The second report [[BftHashSignature]]
   */
  get b() {
    return this.get('b');
  }
  /**
   * @description The round this report applies to as [[U32]]
   */
  get round() {
    return this.get('round');
  }
}
/**
 * @name BftProposeOutOfTurn
 * @description
 * A report for out-of-turn proposals
 */
export class BftProposeOutOfTurn extends Struct {
  constructor(value) {
    super(
      {
        round: U32,
        a: BftHashSignature,
      },
      value
    );
  }
  /**
   * @description The [[BftHashSignature]] the report applies to
   */
  get a() {
    return this.get('a');
  }
  /**
   * @description The round as [[u32]]
   */
  get round() {
    return this.get('round');
  }
}
/**
 * @name BftDoublePropose
 * @description
 * Report of a double-propose
 */
export class BftDoublePropose extends BftAtReport {}
/**
 * @name BftDoublePrepare
 * @description
 * Report of a double-prepare
 */
export class BftDoublePrepare extends BftAtReport {}
/**
 * @name BftDoubleCommit
 * @description
 * Report of a double-commit
 */
export class BftDoubleCommit extends BftAtReport {}
/**
 * @name MisbehaviorKind
 * @description
 * An [[Enum]] containing a Bft misbehaviour
 */
export class MisbehaviorKind extends Enum {
  constructor(value, index) {
    super(
      {
        BftProposeOutOfTurn,
        BftDoublePropose,
        BftDoublePrepare,
        BftDoubleCommit,
      },
      value,
      index
    );
  }
}
/**
 * @name MisbehaviorReport
 * @description
 * A Misbehaviour report of [[MisbehavioirKind]] against a specific [[AuthorityId]]
 */
export default class MisbehaviorReport extends Struct {
  constructor(value) {
    super(
      {
        parentHash: Hash,
        parentNumber: BlockNumber,
        target: AuthorityId,
        misbehavior: MisbehaviorKind,
      },
      value
    );
  }
  /**
   * @description The [[MisbehaviorKind]]
   */
  get misbehavior() {
    return this.get('misbehavior');
  }
  /**
   * @description The [[Hash]] of the parent block
   */
  get parentHash() {
    return this.get('parentHash');
  }
  /**
   * @description The [[BlockNumber]] of the parent
   */
  get parentNumber() {
    return this.get('parentNumber');
  }
  /**
   * @description The [[authorityId]] the report applies to
   */
  get target() {
    return this.get('target');
  }
}
