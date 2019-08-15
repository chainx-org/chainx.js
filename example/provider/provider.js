const { ApiBase, WsProvider } = require('chainx.js');

const chainx = new ApiBase(new WsProvider('wss://w1.chainx.org.cn/ws'));

async function signAndSend(signerAddress, { acceleration, method }, callback) {
  await chainx.isReady;

  const extrinsic = chainx.createExtrinsic(method);

  const fee = await extrinsic.getFee(signerAddress, { acceleration: acceleration });

  console.log('请确认签名信息：');
  console.log('签名账户：', signerAddress);
  console.log('签名内容：', extrinsic.method.toJSON());
  console.log('手续费：', fee);

  // signerAddress 对应的私钥
  return extrinsic.signAndSend(
    '0x1723c11c9e28f5340bcf2225260eac3671144459095d6eaaea091a8826f5987f',
    { acceleration: acceleration },
    callback
  );
}

async function sign(signerAddress, { acceleration, method }, callback) {
  await chainx.isReady;

  const extrinsic = chainx.createExtrinsic(method);

  const fee = await extrinsic.getFee(signerAddress, { acceleration: acceleration });

  console.log('请确认签名信息：');
  console.log('签名账户：', signerAddress);
  console.log('签名内容：', extrinsic.method.toJSON());
  console.log('手续费：', fee);

  // 账户交易次数
  const nonce = await chainx.query.system.accountNonce(signerAddress);

  // signerAddress 对应的私钥
  const signedExtrinsic = extrinsic.sign(
    '0x1723c11c9e28f5340bcf2225260eac3671144459095d6eaaea091a8826f5987f',
    { acceleration: acceleration, nonce },
    callback
  );

  return signedExtrinsic.toHex();
}

class Provider extends WsProvider {
  async signAndSend(signerAddress, { acceleration = 1, method } = {}, callback) {
    return signAndSend(signerAddress, { acceleration, method }, callback);
  }

  async sign(signerAddress, { acceleration = 1, method } = {}) {
    return sign(signerAddress, { acceleration, method });
  }

  async getAccounts() {
    //@TODO 返回钱包的当前帐号的公钥。第一个是当前帐号
    return ['0x02a65e8f1946a38c4c88bacbb269a23558d8528a1cbd8eaa56560558a62d5a5a'];
  }
}

const provider = new Provider('wss://w1.chainx.org.cn/ws');

module.exports = provider;
