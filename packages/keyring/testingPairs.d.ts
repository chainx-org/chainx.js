import { KeyringPair, KeyringOptions } from './types';
declare type TestKeyringMap = {
    [index: string]: KeyringPair;
};
export default function testKeyringPairs(options?: KeyringOptions, isDerived?: boolean): TestKeyringMap;
export {};
