# Chainx.js

目前只接受 websocket 的方式，调用 rpc。使用前需要等待程序初始化完成：

```js
const chainx = new Chainx('wss://w1.chainx.org.cn/ws');

chainx.isRpcReady().then(() => {
  // ...
});

// 监听事件
chainx.on('disconnected', () => {}) // websocket 链接断开
chainx.on('error', () => {}) // 发生一个错误
chainx.on('connected', () => {}) // websocket 已连接
chainx.on('ready', () => {}) // 初始化完成

// 操作 websocket 对象，断开 websocket 连接
chainx.provider.websocket.close()
```

初始化过程会自动会从链上获取网络版本。这将会影响到显示的账号地址的格式。请注意，这是异步的，未初始化完成前，默认是测试网络。
也可以通过 `chainx.account.setNet('mainnet')` 或 `chainx.account.setNet('testnet')`，手动指定网络版本。

## 示例

```javascript
const Chainx = require('chainx.js').default;

(async () => {
  // 目前只支持 websocket 链接
  const chainx = new Chainx('wss://w1.chainx.org/ws');

  // 等待异步的初始化
  await chainx.isRpcReady();

  // 查询某个账户的资产情况
  const bobAssets = await chainx.asset.getAssetsByAccount('5DtoAAhWgWSthkcj7JfDcF2fGKEWg91QmgMx37D6tFBAc6Qg', 0, 10);

  console.log('bobAssets: ', JSON.stringify(bobAssets));

  // 构造交易参数（同步）

  const extrinsic = chainx.asset.transfer('5DtoAAhWgWSthkcj7JfDcF2fGKEWg91QmgMx37D6tFBAc6Qg', 'PCX', '1000', '转账 PCX');

  // 查看 method 哈希
  console.log('Function: ', extrinsic.method.toHex());

  // 签名并发送交易，0x0000000000000000000000000000000000000000000000000000000000000000 是用于签名的私钥
  extrinsic.signAndSend('0x0000000000000000000000000000000000000000000000000000000000000000', (error, response) => {
    if (error) {
      console.log(error);
    } else if (response.status === 'Finalized') {
      if (response.result === 'ExtrinsicSuccess') {
        console.log('交易成功');
      }
    }
  });
})();
```

### 离线签名 websocket 版本

```javascript
const Chainx = require('chainx.js').default;
const nacl = require('tweetnacl');

// 签名过程
async function ed25519Sign(message) {
  // 签名账户的 32 位私钥
  const privateKey = Buffer.from('5858582020202020202020202020202020202020202020202020202020202020', 'hex');
  // 使用 ed25519 算法进行签名。tweetnacl 这个签名用的是 64 位secretKey，实际上等于 privateKey + publicKey。通过这个方法nacl.sign.keyPair.fromSeed，可以从 privateKey 获取到 secretKey。
  return nacl.sign.detached(message, nacl.sign.keyPair.fromSeed(privateKey).secretKey);
}

(async () => {
  // 目前只支持 websocket 链接
  const chainx = new Chainx('wss://w1.chainx.org/ws');

  // 等待异步的初始化
  await chainx.isRpcReady();

  // 签名账户的公钥
  const address = '5CjVPmj6Bm3TVUwfY5ph3PE2daxPHp1G3YZQnrXc8GDjstwT';

  // 投票提息
  const extrinsic = chainx.stake.voteClaim(address);

  // 获取该账户交易次数
  const nonce = await extrinsic.getNonce(address);

  // 获取待签原文
  // 可传入参数： extrinsic.encodeMessage(address, { nonce, acceleration = 1, blockHash = genesisHash, era = '0x00' })
  const encoded = extrinsic.encodeMessage(address, { nonce, acceleration: 10 });

  // 离线签名
  const signature = await ed25519Sign(encoded);

  // 注入签名
  extrinsic.appendSignature(signature);

  // 发送到链上的数据
  // console.log(extrinsic.toHex())

  // 发送交易
  extrinsic.send((error, result) => {
    console.log(error, result);
  });
})();
```

### 离线签名 http 版本

```javascript
const { ApiBase, HttpProvider } = require('chainx.js');
const nacl = require('tweetnacl');

// 签名过程
async function ed25519Sign(message) {
  // 签名账户的 32 位私钥
  const privateKey = Buffer.from('5858582020202020202020202020202020202020202020202020202020202020', 'hex');
  // 使用 ed25519 算法进行签名。
  return nacl.sign.detached(message, nacl.sign.keyPair.fromSeed(privateKey).secretKey);
}

(async () => {
  const chainx = new ApiBase(new HttpProvider('https://w1.chainx.org/rpc'));

  await chainx._isReady;

  // 签名账户的公钥
  const address = '5CjVPmj6Bm3TVUwfY5ph3PE2daxPHp1G3YZQnrXc8GDjstwT';

  // 投票提息
  const extrinsic = chainx.tx.xStaking.claim(address);

  // 获取该账户交易次数
  const nonce = await chainx.query.system.accountNonce(address);

  // 获取待签原文
  // 可传入参数： extrinsic.encodeMessage(address, { nonce, acceleration = 1, blockHash = genesisHash, era = '0x00' })
  const encoded = extrinsic.encodeMessage(address, { nonce, acceleration: 10 });

  // 获取手续费，
  const fee = await extrinsic.getFee(address, { acceleration: 1 });

  console.log('fee', fee)

  // 离线签名
  const signature = await ed25519Sign(encoded);

  // 注入签名
  extrinsic.appendSignature(signature);

  // 发送交易
  const txHash = await extrinsic.send();

  console.log(txHash);
})();

```
