import BN from 'bn.js';
export interface ExtErrorInterface {
    code: number;
    data: any;
    message: string;
    stack: string;
}
declare type Logger$Data$Fn = () => Array<any>;
export declare type Logger$Data = Array<any | Logger$Data$Fn>;
export declare type Logger = {
    debug: (...values: Logger$Data) => void;
    error: (...values: Logger$Data) => void;
    log: (...values: Logger$Data) => void;
    noop: (...values: Logger$Data) => void;
    warn: (...values: Logger$Data) => void;
};
export interface ToBnOptions {
    isLe?: boolean;
    isNegative?: boolean;
}
export declare type BnList = {
    0: BN;
    1: BN;
} & Array<BN>;
export {};
