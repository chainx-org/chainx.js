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

几乎所有 api 函数的参数都对应一个类型定义。此时只要传入参数能被解析，即是合法的。例如：`accountId` 有很多种表现形式：

- `bs58` 格式 `"5Ey5ZRPVfGee7DVview3h3FkwMU6WTw2NZjYxD7o3NED7bZe"`
- `hex` 格式 `"0x806a491666670aa087e04770c025d64b2ecebfd91a74efdc4f4329642de32365"`
- `Buffer` 对象 `<Buffer 80 6a 49 16 66 67 0a a0 87 e0 47 70 c0 25 d6 4b 2e ce bf d9 1a 74 ef dc 4f 43 29 64 2d e3 23 65>`
- `Uint8Array` 对象 `Uint8Array [ 128, 106, 73, 22, 102, 103, 10, 160, 135, 224, 71, 112, 192, 37, 214, 75, 46, 206, 191, 217, 26, 116, 239, 220, 79, 67, 41, 100, 45, 227, 35, 101]`

以上均是合法的参数。

大部分类型都存在两个基本的方法：`toJSON()`，`toHex()`，`toJSON()` 用于将数据转化为用于 javascript 中的基础类型。而 `toHex()` 则一般是用于获取该数据编码后的二进制的十六进制的表示。在 `chainx.js` 中存在几种基本的类型，其余的类型基本上都是从它们中派生出来的。

- 数字类型 [`UInt`](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/codec/UInt.js)： 在 chainx.js 内部，几乎所有的无符号数字都是继承于 `UInt` 类型，它是基于 `Bn.js` 实现的。常见的如 `Balance`，`U32`，`U64` 都是它的子类。

## 发送交易

我们需要有几个步骤，来完成一次完整的交易。首先确定我们需要调用的 Method，

## Api

## 交易函数

以下 api 均返回一个 [Extrinsic](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Extrinsic.js) 对象。注意所有涉及到金额的部分，均是以最小的精度为单位。不存在小数。

### chainx.trade.putOrder([pair_index](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/TradingPairIndex.js), [order_type](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/OrderType.js), [order_direction](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/OrderDirection.js), [amount](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Balance.js), [price](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Price.js))

### chainx.trade.cancelOrder([pair_index](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/TradingPairIndex.js), [order_index](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/OrderIndex.js))

### chainx.stake.nominate([targetAddress](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Address.js), [value](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Balance.js), [memo](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Memo.js))

对节点投票。

#### 参数

- `targetAddress`：被投票的节点的地址
- `value`: 投票金额
- `memo`: 备注

#### 例子：

```javascript
chainx.stake.nominate('5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ', 1000, '投票');
```

### chainx.stake.unnominate([targetAddress](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Address.js),  [value](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Balance.js),  [memo](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Memo.js))

撤销对节点的投票。

#### 参数

- `targetAddress` ：撤票节点
- `value` ：撤票金额
- `memo`：备注

#### 例子

```javascript
chainx.stake.refresh('5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ', 1000, '撤销投票');
```

### chainx.stake.refresh([url?](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/URL.js),  [desire_to_run?](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Bool.js),  [next_key?](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/SessionKey.js),  [about?](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Text.js))

更新节点网址，参选状态，出块地址和关于。所有参数均是可选项，不传需要填写 `null` 作为占位。

#### 参数

- `url`: 节点网址
- `desireToRun`: 是否参选
- `nextKey`: 出块地址
- `about`: 关于

#### 例子

```js
chainx.stake.refresh(null, true, null, '我是节点');
```

### chainx.stake.voteClaim([target](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Address.js))

选举投票提息。

#### 参数

- `target`: 投票节点

#### 例子

```js
chainx.stake.voteClaim('5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ');
```

### chainx.stake.depositClaim([token](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Token.js))

充值挖矿提息。

#### 参数

- `token`: 充值币种

#### 例子

```js
chainx.stake.depositClaim('BTC');
```

### chainx.stake.unfreeze([target](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Address.js),  [revocation_index](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js))

撤销投票后，撤销金额有一定的时候锁定期。锁定期满后，可以对锁定金额进行解冻，使其变为可用余额。

#### 参数

- `target`: 解冻节点

- `revocationIndex`: 解冻索引。 用户对同一解冻节点可能同时有多次解冻操作，该索引指明解冻编号

#### 例子

```js
chainx.stake.unfreeze('5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ', 1);
```

### chainx.stake.setupTrustee([chain](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Chain.js),  [about](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Text.js),  [hot_entity](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/TrusteeEntity.js), [cold_entity](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/TrusteeEntity.js))

设置信托节点信息。

#### 参数

- `chain`: 链 ID

- `about`: 关于

- `hotEntity`: 链的热地址

- `coldEntity`: 链的冷地址

#### 例子

```js
chainx.stake.unfreeze('ChainX', 'about', ['Bitcoin', '0x......'], ['Bitcoin', '0x......']);
```



### 查询函数

## 扩展
