# Chainx.js

## 安装

```bash
yarn add chainx.js
```

或者

```bash
npm install chainx.js
```

## 快速开始

示例：

```javascript
const Chainx = require('chainx.js').default;

(async () => {
  // 目前只支持 websocket 链接
  const chainx = new Chainx('wss://w1.chainx.org.cn/ws');

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

## 文档

### JS-SDK

https://github.com/chainx-org/ChainX/wiki/JS-SDK

### RPC

https://github.com/chainx-org/ChainX/wiki/RPC
