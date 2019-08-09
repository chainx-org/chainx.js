export declare type Keypair = {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
};
export declare type Seedpair = {
    publicKey: Uint8Array;
    seed: Uint8Array;
};
export declare type KeypairType = 'ed25519' | 'sr25519';
