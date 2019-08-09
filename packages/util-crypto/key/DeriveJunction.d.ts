import BN from 'bn.js';
export default class DeriveJunction {
    private _chainCode;
    private _isHard;
    static from(value: string): DeriveJunction;
    readonly chainCode: Uint8Array;
    readonly isHard: boolean;
    readonly isSoft: boolean;
    hard(value: number | BN | string | Uint8Array): DeriveJunction;
    harden(): DeriveJunction;
    soft(value: number | BN | string | Uint8Array): DeriveJunction;
    soften(): DeriveJunction;
}
