import Struct from './codec/Struct';
import AddrType from './AddrType';
import Proposal from './Proposal';
import U32 from './U32';
import U64 from './U64';

export default class PendingState extends Struct {
  constructor(value) {
    super(
      {
        yetNeeded: U32,
        ownersDone: U64,
        proposal: Proposal,
      },
      value
    );
  }
}
