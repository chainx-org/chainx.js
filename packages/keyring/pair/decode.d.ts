import { PairInfo } from './types';
declare type DecodeResult = PairInfo & {
    secretKey: Uint8Array;
};
export default function decode(passphrase?: string, _encrypted?: Uint8Array | null): DecodeResult;
export {};
