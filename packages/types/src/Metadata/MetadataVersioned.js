// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { assert } from '@chainx/util';
import Enum from '../codec/Enum';
import Struct from '../codec/Struct';
import MagicNumber from './MagicNumber';
import MetadataV2 from './v2';
import MetadataV3 from './v3';
import MetadataV4 from './v4';
import MetadataV5 from './v5';
import v0ToV1 from './v0/toV1';
import v1ToV2 from './v1/toV2';
import v2ToV3 from './v2/toV3';
import v3ToV4 from './v3/toV4';
import v4ToV5 from './v4/toV5';
import { getUniqTypes, toCallsOnly } from './util';

class MetadataEnum extends Enum {
  constructor(value, index) {
    super(
      {
        V0: 'MetadataV0',
        V1: 'MetadataV1',
        V2: MetadataV2,
        V3: MetadataV3,
        V4: MetadataV4,
        V5: MetadataV5,
      },
      value,
      index
    );
  }
  /**
   * @description Returns the wrapped values as a V0 object
   */
  get asV0() {
    assert(this.isV0, `Cannot convert '${this.type}' via asV0`);
    return this.value;
  }
  /**
   * @description Returns the wrapped values as a V1 object
   */
  get asV1() {
    assert(this.isV1, `Cannot convert '${this.type}' via asV1`);
    return this.value;
  }
  /**
   * @description Returns the wrapped values as a V2 object
   */
  get asV2() {
    assert(this.isV2, `Cannot convert '${this.type}' via asV2`);
    return this.value;
  }
  /**
   * @description Returns the wrapped values as a V3 object
   */
  get asV3() {
    assert(this.isV3, `Cannot convert '${this.type}' via asV3`);
    return this.value;
  }
  /**
   * @description Returns the wrapped values as a V4 object
   */
  get asV4() {
    assert(this.isV4, `Cannot convert '${this.type}' via asV4`);
    return this.value;
  }
  /**
   * @description Returns the wrapped values as a V5 object
   */
  get asV5() {
    assert(this.isV5, `Cannot convert '${this.type}' via asV5`);
    return this.value;
  }
  /**
   * @description `true` if Deprecated
   */
  get isDeprecated() {
    return this.type === 'MetadataDeprectated';
  }
  /**
   * @description `true` if V0
   */
  get isV0() {
    return this.type === 'V0';
  }
  /**
   * @description `true` if V1
   */
  get isV1() {
    return this.type === 'V1';
  }
  /**
   * @description `true` if V2
   */
  get isV2() {
    return this.type === 'V2';
  }
  /**
   * @description `true` if V3
   */
  get isV3() {
    return this.type === 'V3';
  }
  /**
   * @description `true` if V4
   */
  get isV4() {
    return this.type === 'V4';
  }
  /**
   * @description `true` if V5
   */
  get isV5() {
    return this.type === 'V5';
  }
}
/**
 * @name MetadataVersioned
 * @description
 * The versioned runtime metadata as a decoded structure
 */
export default class MetadataVersioned extends Struct {
  constructor(value) {
    super(
      {
        magicNumber: MagicNumber,
        metadata: MetadataEnum,
      },
      value
    );
    this._converted = new Map();
  }
  assertVersion(version) {
    assert(this.version <= version, `Cannot convert metadata from v${this.version} to v${version}`);
    return this.version === version;
  }
  getVersion(version, fromPrev) {
    const asCurr = `asV${version}`;
    const asPrev = `asV${version - 1}`;
    if (this.assertVersion(version)) {
      return this.metadata[asCurr];
    }
    if (!this._converted.has(version)) {
      this._converted.set(version, fromPrev(this[asPrev]));
    }
    return this._converted.get(version);
  }
  /**
   * @description Returns the wrapped metadata as a limited calls-only (latest) version
   */
  get asCallsOnly() {
    return new MetadataVersioned({
      magicNumber: this.magicNumber,
      metadata: new MetadataEnum(toCallsOnly(this.asLatest), this.version),
    });
  }
  /**
   * @description Returns the wrapped metadata as a V0 object
   */
  get asV0() {
    this.assertVersion(0);
    return this.metadata.asV0;
  }
  /**
   * @description Returns the wrapped values as a V1 object
   */
  get asV1() {
    return this.getVersion(1, v0ToV1);
  }
  /**
   * @description Returns the wrapped values as a V2 object
   */
  get asV2() {
    return this.getVersion(2, v1ToV2);
  }
  /**
   * @description Returns the wrapped values as a V3 object
   */
  get asV3() {
    return this.getVersion(3, v2ToV3);
  }
  /**
   * @description Returns the wrapped values as a V4 object
   */
  get asV4() {
    return this.getVersion(4, v3ToV4);
  }
  /**
   * @description Returns the wrapped values as a V5 object
   */
  get asV5() {
    return this.getVersion(5, v4ToV5);
  }
  /**
  /**
   * @description Returns the wrapped values as a latest version object
   */
  get asLatest() {
    return this.asV5;
  }
  /**
   * @description
   */
  get magicNumber() {
    return this.get('magicNumber');
  }
  /**
   * @description the metadata wrapped
   */
  get metadata() {
    return this.get('metadata');
  }
  /**
   * @description the metadata version this structure represents
   */
  get version() {
    return this.metadata.index;
  }
  getUniqTypes(throwError) {
    return getUniqTypes(this.asLatest, throwError);
  }
}
