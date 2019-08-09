import { Prefix } from './types';
export default function decode(encoded: string | Uint8Array, ignoreChecksum?: boolean, prefix?: Prefix): Uint8Array;
