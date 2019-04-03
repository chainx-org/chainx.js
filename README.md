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
  const bobAssets = await chainx.asset.getAssets('5DtoAAhWgWSthkcj7JfDcF2fGKEWg91QmgMx37D6tFBAc6Qg');

  console.log('bobAssets:', JSON.stringify(bobAssets));

  // 构造交易参数（同步）

  const extrinsic = chainx.asset.transfer();

  // 查看 method 哈希
  console.log(extrinsic.method.toHex());

  // 签名并发送交易
  extrinsic.signAndSend('<账户私钥>', response => {
    if (response.status === 'Finalised') {
      if (response.result === 'ExtrinsicSuccess') {
        console.log('交易成功');
      }
    }
  });
})();
```

## 数据结构

## Api

## 扩展
