// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Vec from './codec/Vec';
import Extrinsic from './Extrinsic';
/**
 * @name Extrinsics
 * @description
 * A [[Vec]] of [[Extrinsic]]
 */
export default class Extrinsics extends Vec.with(Extrinsic) {}
