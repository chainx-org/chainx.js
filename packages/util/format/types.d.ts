import BN from 'bn.js';
export interface Compact {
    toBn: () => BN;
    unwrap: () => BN | Date;
}
