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
## 类型定义

几乎所有 api 函数的参数都对应一个类型定义。此时只要传入参数能被解析，即是合法的。例如：accountId 有很多种表现形式：

- bs58 格式 "5Ey5ZRPVfGee7DVview3h3FkwMU6WTw2NZjYxD7o3NED7bZe"
- hex 格式 "0x806a491666670aa087e04770c025d64b2ecebfd91a74efdc4f4329642de32365"
- Buffer 对象 <Buffer 80 6a 49 16 66 67 0a a0 87 e0 47 70 c0 25 d6 4b 2e ce bf d9 1a 74 ef dc 4f 43 29 64 2d e3 23 65>
- Uint8Array 对象 Uint8Array [ 128, 106, 73, 22, 102, 103, 10, 160, 135, 224, 71, 112, 192, 37, 214, 75, 46, 206, 191, 217, 26, 116, 239, 220, 79, 67, 41, 100, 45, 227, 35, 101]

以上变体均是合法的参数。

## 发送交易

我们需要有几个步骤，来完成一次完整的交易。首先确定我们需要调用的 Method，

## Api

### 交易函数

以下 api 均返回一个 [Extrinsic](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Extrinsic.js) 对象：

#### chainx.trade.putOrder(pair_index, order_type, order_direction, amount, price)

挂单

#### chainx.trade.cancelOrder(pair_index, order_index)

撤单

### 查询函数

## 扩展
