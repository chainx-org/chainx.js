export declare type SiDef = {
    power: number;
    text: string;
    value: string;
};
export declare const SI_MID = 8;
export declare const SI: Array<SiDef>;
export declare function calcSi(text: string, decimals: number): SiDef;
export declare function findSi(type: string): SiDef;
