import { KeyringInstance, KeyringOptions } from './types';
/**
 * @name testKeyring
 * @summary Create an instance of Keyring pre-populated with locked test accounts
 * @description The test accounts (i.e. alice, bob, dave, eve, ferdie)
 * are available on the dev chain and each test account is initialised with DOT funds.
 */
export default function testKeyring(options?: KeyringOptions, isDerived?: boolean): KeyringInstance;
