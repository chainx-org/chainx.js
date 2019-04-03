import KeyStore from '..';

describe('keystore', () => {
  it('can work', () => {
    const privateKey = '0xa3fd913a9606bb71b04e74ee6afe69b4154782cfc47c9076d041c7a4ab11cf9e';
    const passphrase = '123456';

    const json = KeyStore.encrypt(privateKey, passphrase);
    const decrypted = KeyStore.decrypt(json, passphrase);

    expect(decrypted).toEqual(privateKey);
  });
});
