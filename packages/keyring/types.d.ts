import { KeypairType } from '@chainx/util-crypto/types';
import { Prefix } from './address/types';
export declare type KeyringOptions = {
    addressPrefix?: Prefix;
    type?: KeypairType;
};
export declare type KeyringPair$Meta = {
    [index: string]: any;
};
export declare type KeyringPair$JsonVersion = '0' | '1' | '2';
export declare type KeyringPair$JsonEncoding = {
    content: ['pkcs8', KeypairType];
    type: 'xsalsa20-poly1305' | 'none';
    version: KeyringPair$JsonVersion;
};
export declare type KeyringPair$Json = {
    address: string;
    encoded: string;
    encoding: KeyringPair$JsonEncoding;
    meta: KeyringPair$Meta;
};
export interface KeyringPair {
    readonly type: KeypairType;
    address: () => string;
    decodePkcs8: (passphrase?: string, encoded?: Uint8Array) => void;
    encodePkcs8: (passphrase?: string) => Uint8Array;
    getMeta: () => KeyringPair$Meta;
    isLocked: () => boolean;
    lock: () => void;
    publicKey: () => Uint8Array;
    setMeta: (meta: KeyringPair$Meta) => void;
    sign(message: Uint8Array): Uint8Array;
    toJson(passphrase?: string): KeyringPair$Json;
    verify(message: Uint8Array, signature: Uint8Array): boolean;
}
export interface KeyringPairs {
    add: (pair: KeyringPair) => KeyringPair;
    all: () => Array<KeyringPair>;
    get: (address: string | Uint8Array) => KeyringPair;
    remove: (address: string | Uint8Array) => void;
}
export interface KeyringInstance {
    readonly pairs: Array<KeyringPair>;
    readonly publicKeys: Array<Uint8Array>;
    readonly type: KeypairType;
    decodeAddress(encoded: string | Uint8Array, ignoreChecksum?: boolean): Uint8Array;
    encodeAddress(key: Uint8Array | string): string;
    setAddressPrefix(prefix: Prefix): void;
    addPair(pair: KeyringPair): KeyringPair;
    addFromAddress(address: string | Uint8Array, meta?: KeyringPair$Meta, encoded?: Uint8Array | null, type?: KeypairType, ignoreChecksum?: boolean): KeyringPair;
    addFromJson(pair: KeyringPair$Json, ignoreChecksum?: boolean): KeyringPair;
    addFromMnemonic(mnemonic: string, meta?: KeyringPair$Meta, type?: KeypairType): KeyringPair;
    addFromSeed(seed: Uint8Array, meta?: KeyringPair$Meta, type?: KeypairType): KeyringPair;
    addFromUri(suri: string, meta?: KeyringPair$Meta, type?: KeypairType): KeyringPair;
    createFromUri(suri: string, meta?: KeyringPair$Meta, type?: KeypairType): KeyringPair;
    getPair(address: string | Uint8Array): KeyringPair;
    getPairs(): Array<KeyringPair>;
    getPublicKeys(): Array<Uint8Array>;
    removePair(address: string | Uint8Array): void;
    toJson(address: string | Uint8Array, passphrase?: string): KeyringPair$Json;
}
