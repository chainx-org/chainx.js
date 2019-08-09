import BN from 'bn.js';
import { SiDef } from './si';
declare type Defaults = {
    decimals: number;
    unit: string;
};
interface BalanceFormatter {
    (input?: number | string | BN, withSi?: boolean, decimals?: number): string;
    calcSi(text: string, decimals?: number): SiDef;
    findSi(type: string): SiDef;
    getDefaults(): Defaults;
    getOptions(decimals?: number): Array<SiDef>;
    setDefaults(defaults: Partial<Defaults>): void;
}
declare const formatBalance: BalanceFormatter;
export default formatBalance;
