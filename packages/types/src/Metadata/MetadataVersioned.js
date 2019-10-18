// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { assert, isUndefined } from '@chainx/util';
import Enum from '../codec/Enum';
import Struct from '../codec/Struct';
import MagicNumber from './MagicNumber';
import MetadataV0 from './v0';
import MetadataV1 from './v1';
import MetadataV2 from './v2';
import MetadataV3 from './v3';
import MetadataV4 from './v4';
import MetadataV5 from './v5';

import v0ToV1 from './v0/toV1';
import v1ToV2 from './v1/toV2';
import v2ToV3 from './v2/toV3';
import v3ToV4 from './v3/toV4';
import v4ToV5 from './v4/toV5';

class MetadataEnum extends Enum {
  constructor(value) {
    super(
      {
        MetadataV0,
        MetadataV1,
        MetadataV2,
        MetadataV3,
        MetadataV4,
        MetadataV5,
      },
      value
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
   * @description `true` if Deprecated
   */
  get isDeprecated() {
    return this.type === 'MetadataDeprectated';
  }
  /**
   * @description `true` if V0
   */
  get isV0() {
    return this.type === 'MetadataV0';
  }
  /**
   * @description `true` if V1
   */
  get isV1() {
    return this.type === 'MetadataV1';
  }
  /**
   * @description `true` if V2
   */
  get isV2() {
    return this.type === 'MetadataV2';
  }
  /**
   * @description `true` if V3
   */
  get isV3() {
    return this.type === 'MetadataV3';
  }
  /**
   * @description `true` if V4
   */
  get isV4() {
    return this.type === 'MetadataV4';
  }
  /**
   * @description The version this metadata represents
   */
  get version() {
    return this.index;
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
  /**
   * @description Returns the wrapped metadata as a V0 object
   */
  get asV0() {
    assert(this.metadata.version === 0, `Cannot convert metadata from v${this.metadata.version} to v0`);
    return this.metadata.asV0;
  }
  /**
   * @description Returns the wrapped values as a V1 object
   */
  get asV1() {
    assert(this.metadata.version <= 1, `Cannot convert metadata from v${this.metadata.version} to v1`);
    if (this.metadata.version === 1) {
      return this.metadata.asV1;
    }
    if (isUndefined(this._convertedV1)) {
      this._convertedV1 = v0ToV1(this.asV0);
    }
    return this._convertedV1;
  }
  /**
   * @description Returns the wrapped values as a V2 object
   */
  get asV2() {
    assert(this.metadata.version <= 2, `Cannot convert metadata from v${this.metadata.version} to v2`);
    if (this.metadata.version === 2) {
      return this.metadata.asV2;
    }
    if (isUndefined(this._convertedV2)) {
      this._convertedV2 = v1ToV2(this.asV1);
    }
    return this._convertedV2;
  }
  /**
   * @description Returns the wrapped values as a V3 object
   */
  get asV3() {
    assert(this.metadata.version <= 3, `Cannot convert metadata from v${this.metadata.version} to v3`);
    if (this.metadata.version === 3) {
      return this.metadata.asV3;
    }
    if (isUndefined(this._convertedV3)) {
      this._convertedV3 = v2ToV3(this.asV2);
    }
    return this._convertedV3;
  }
  getUniqTypes(throwError) {
    return this.asV4.getUniqTypes(throwError);
  }
  /**
   * @description Returns the wrapped values as a V4 object
   */
  get asV4() {
    assert(this.metadata.version <= 4, `Cannot convert metadata from v${this.metadata.version} to v4`);
    if (this.metadata.version === 4) {
      return this.metadata.asV4;
    }
    if (isUndefined(this._convertedV4)) {
      this._convertedV4 = v3ToV4(this.asV3);
    }
    return this._convertedV4;
  }

  /**
   * @description Returns the wrapped values as a V5 object
   */
  get asV5() {
    assert(this.metadata.version <= 5, `Cannot convert metadata from v${this.metadata.version} to v5`);
    if (this.metadata.version === 5) {
      return this.metadata.asV5;
    }
    if (isUndefined(this._convertedV4)) {
      this._convertedV5 = v4ToV5(this.asV5);
    }
    return this._convertedV5;
  }
}
