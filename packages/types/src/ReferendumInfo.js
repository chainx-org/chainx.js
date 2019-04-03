// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import BlockNumber from './BlockNumber';
import Struct from './codec/Struct';
import Proposal from './Proposal';
import VoteThreshold from './VoteThreshold';
/**
 * @name ReferendumInfo
 * @description
 * Info regarding an ongoing referendum
 */
export default class ReferendumInfo extends Struct {
  constructor(value) {
    super(
      {
        end: BlockNumber,
        proposal: Proposal,
        threshold: VoteThreshold,
        delay: BlockNumber,
      },
      value
    );
  }
  /**
   * @description When voting on this referendum will end
   */
  get end() {
    return this.get('end');
  }
  /**
   * @description The proposal being voted on
   */
  get proposal() {
    return this.get('proposal');
  }
  /**
   * @description The thresholding mechanism to determine whether it passed
   */
  get threshold() {
    return this.get('threshold');
  }
  /**
   * @description The delay (in blocks) to wait after a successful referendum before deploying
   */
  get delay() {
    return this.get('delay');
  }
}
