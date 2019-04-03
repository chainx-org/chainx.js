import Account from '../index';

describe('account', () => {
  const privateKey = '0x9fadda939f3f895c8af7625340c822801ddeb757da20c0895c27a6e9113e2d90';
  // prettier-ignore
  const publicKey = Uint8Array.from([214, 205, 155, 167, 183, 235, 156, 128, 190, 99, 106, 67, 44, 121, 66, 212, 251, 180, 137, 21, 230, 250, 151, 156, 129, 3, 7, 254, 188, 135, 234, 9]);
  const address = '5GvMBZHrqB4ktr5VCxEQXN7wJAB95BAM2PtuHAWxqGKHXfKH';
  let account;

  beforeEach(() => {
    account = Account.from(privateKey);
  });

  it('should has publicKey key', function() {
    expect(account.publicKey()).toEqual('0xd6cd9ba7b7eb9c80be636a432c7942d4fbb48915e6fa979c810307febc87ea09');
  });

  it('should has public key', function() {
    expect(account.address()).toEqual(address);
  });

  it('can be generated from plain text', () => {
    const account = Account.fromText('Alice');
    expect(account.address()).toEqual('5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ');
  });

  it('get private key', () => {
    const account = Account.fromText('Alice');
    expect(account.privateKey()).toEqual('0x416c696365202020202020202020202020202020202020202020202020202020');
  });
});

describe('account', () => {
  const mnemonic = 'seed sock milk update focus rotate barely fade car face mechanic mercy';
  const address = '5CDJoYs49NQToyKJzT7zmne1Z8PQB39WT6nC4V987pWQQ2St';
  let account;

  beforeEach(() => {
    account = Account.fromMnemonic(mnemonic);
  });

  it('can import from mnemonic', () => {
    expect(account.address()).toEqual(address);
  });

  it('can derive new account', () => {
    expect(account.derive().address()).toEqual('5E9mJPEYcSwBdufkwmbTvk1FUdoM7mEtExdcCRTX2Rv38GPs');
  });

  it('can validate mnemonic', () => {
    expect(Account.isMnemonicValid(mnemonic)).toBeTruthy();

    const wrongMnemonic = 'seed sock milk update focus rotate barely fade car face mechanic merc';
    expect(Account.isMnemonicValid(wrongMnemonic)).toBeFalsy();
  });
});

describe('account', () => {
  const privateKey = '0x9fadda939f3f895c8af7625340c822801ddeb757da20c0895c27a6e9113e2d90';
  const address = '5GvMBZHrqB4ktr5VCxEQXN7wJAB95BAM2PtuHAWxqGKHXfKH';

  let account;

  beforeEach(() => {
    account = Account.fromPrivateKey(privateKey);
  });

  it('can import from private key', () => {
    expect(account.address()).toEqual(address);
  });
});

describe('account', () => {
  it('can generate new account', () => {
    const account = Account.generate();
    expect(account).not.toBeNull();
    expect(account.address).not.toBeNull();
  });

  it('generate new mnemonic', () => {
    const mnemonic = Account.newMnemonic();
    expect(typeof mnemonic).toBe('string');

    const words = mnemonic.split(' ');
    expect(words.length).toEqual(12);
  });
});

describe('account from', () => {
  // prettier-ignore
  const aliceSecretKey = {
    publicKey: new Uint8Array([209, 114, 167, 76, 218, 76, 134, 89, 18, 195, 43, 160, 168, 10, 87, 174, 105, 171, 174, 65, 14, 92, 203, 89, 222, 232, 78, 47, 68, 50, 219, 79]),
    secretKey: new Uint8Array([65, 108, 105, 99, 101, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 209, 114, 167, 76, 218, 76, 134, 89, 18, 195, 43, 160, 168, 10, 87, 174, 105, 171, 174, 65, 14, 92, 203, 89, 222, 232, 78, 47, 68, 50, 219, 79])
  }

  // prettier-ignore
  const aliceSeed = new Uint8Array([
    65,108,105,99,101,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32
  ]);
  const alicePublicKey = '0xd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f';

  const aliceSeedHex = '0x416c696365202020202020202020202020202020202020202020202020202020';
  const aliceSecretHex =
    '0x416c696365202020202020202020202020202020202020202020202020202020d172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f';

  it('from seed', () => {
    expect(Account.fromSeed('Alice').publicKey()).toEqual(alicePublicKey);
    expect(Account.fromSeed(aliceSeedHex).publicKey()).toEqual(alicePublicKey);
    expect(Account.fromSeed(aliceSeed).publicKey()).toEqual(alicePublicKey);
    expect(Account.fromSeed(aliceSeed).publicKey()).toEqual(alicePublicKey);
  });

  it('from screctKey', () => {
    expect(Account.fromSecretKey(aliceSecretHex).publicKey()).toEqual(alicePublicKey);
    expect(Account.fromSecretKey(aliceSecretKey.secretKey).publicKey()).toEqual(alicePublicKey);
  });

  it('from', () => {
    expect(Account.from('Alice').publicKey()).toEqual(alicePublicKey);
    expect(Account.from(Account.from('Alice').pkcs8()).publicKey()).toEqual(alicePublicKey);
    expect(Account.from(aliceSeedHex).publicKey()).toEqual(alicePublicKey);
    expect(Account.from(aliceSeed).publicKey()).toEqual(alicePublicKey);
    expect(Account.from(aliceSeed).publicKey()).toEqual(alicePublicKey);
    expect(Account.from(aliceSecretHex).publicKey()).toEqual(alicePublicKey);
    expect(Account.from(aliceSecretKey.secretKey).publicKey()).toEqual(alicePublicKey);
  });
});

describe('net', () => {
  it('can generate new account', () => {
    const Alice = Account.from('Alice');
    expect(Account.decodeAddress('5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ')).toEqual(Alice.publicKey());
    expect(Account.decodeAddress('5UNeSYb4r98ze8KQczfLFrX9UUTyC1iAaUwzrnpfKouL93UG')).toEqual(Alice.publicKey());
  });
});
