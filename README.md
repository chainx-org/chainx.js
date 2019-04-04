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



## 交易函数

以下 api 均返回一个 [Extrinsic](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Extrinsic.js) 对象。注意所有涉及到金额的部分，均是以最小的精度为单位。不存在小数。

### chainx.asset.transfer([dest](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/AccountId.js), [token](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/AccountId.js), [value](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Balance.js), [memo](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Balance.js))

转账

#### 参数

- `dest`：接收人的地址
- `token`：转账的币种
- `value`：转账金额（最小的精度，只能为整数）
- `memo`：备注

#### 例子：

```javascript
chainx.asset.transfer('5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ', 'PCX', 1000, '转给你');
```

### chainx.asset.withdraw([token](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Token.js), [value](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Balance.js), [addr](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/AddrStr.js), [ext](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Memo.js))

提现

#### 参数

- `token`：提现的资产类型
- `value`：提现的数量
- `addr`：接收的地址
- `ext`：备注

#### 例子：

```javascript
chainx.asset.withdraw('BTC', 100, '5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ', '提现');
```

### chainx.asset.createWithdrawTx([withdrawalIdList](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/codec/Vector.js), [tx](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Bytes.js))

提交构造的提现交易原文

#### 参数

- `withdrawalIdList`：提现ID列表
- `tx`：构造的待签原文

#### 例子：

```javascript
chainx.asset.createWithdrawTx([1, 2], '0x......');
```

### chainx.asset.signWithdrawTx([tx?](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Bytes.js))

提交签名后的交易原文

#### 参数

- `tx`：签名后的交易原文

#### 例子：

```javascript
chainx.asset.signWithdrawTx('0x......');
```

### chainx.trade.putOrder([pair_index](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/TradingPairIndex.js), [order_type](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/OrderType.js), [order_direction](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/OrderDirection.js), [amount](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Balance.js), [price](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Price.js))

用户挂单

#### 参数

- `pairid`：交易对ID
- `ordertype`：类型（限价单|市价单)
- `direction`：方向（买单|卖单)
- `amount`：数量
- `price`：价格

#### 例子：

```javascript
chainx.trade.putOrder(1, 'Limit', 'Buy', 100, 100);
```

### chainx.trade.cancelOrder([pair_index](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/TradingPairIndex.js), [order_index](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/OrderIndex.js))

取消挂单

#### 参数

- `pairid`：交易对ID
- `index`：用户委托编号

#### 例子：

```javascript
chainx.trade.cancelOrder(0, 2);
```

### chainx.stake.register([name](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Name.js))

注册节点。

#### 参数

- `name`：注册节点的名称

#### 例子：

```javascript
chainx.stake.register('节点');
```

###

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
chainx.stake.setupTrustee('ChainX', 'about', ['Bitcoin', '0x......'], ['Bitcoin', '0x......']);
```

## 查询函数

无特别说明，则查询函数的参数返回的均是 Promise。

### chainx.chain.getInfo()

获取链的基本信息

### 参数

无

### 例子

```js
chainx.chain.getInfo()
/**
{ name: 'ChainX V0.9.7', version: '0.9.7', era: 'ChainX' }
**/
```

### chainx.chain.getBlockPeriod()

获取出块的间隔

### 参数

无

### 例子

```js
chainx.chain.getBlockPeriod()
/**
2 // 2 秒一个块
**/
```

### chainx.chain.subscribeNewHead()

订阅最新的块，返回一个 rxjs 标准的 `observable`

### 参数

无

### 例子

```js
const subscription = chainx.chain.subscribeNewHead().subscribe(result => {
  console.log('当前块高：', result.number)
  subscription.unsubscribe() // 取消订阅
})
/**
{ 
  "number": 381887, // 当前块高
  "hash": "0x513fbb976d775d7cda6d1b4b659160a5fd8ae9aed0c3f296123a067948837cd7", // 当前块哈希
  "now": 1554363156 // 当前出块时间
}
**/
```

### 

### chainx.asset.getAssetsByAccount([who](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Address.js), [page_index](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js), [page_size](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js))

用户资产信息

### 参数

- `who`: AccountId 账户
- `page_index`: u32 页码 (从0开始)
- `page_size`: u32 页大小 (<=100)

### 例子

```js
chainx.asset.getAssetsByAccount('5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ', 0, 10)
/**
{
  "data": [
    // 资产列表， 内容同上
    {
      "details": {
        // key 是资产类型的枚举
        "Free": 1000000000,
        "ReservedDexFuture": 0,
        "ReservedDexSpot": 0,
        "ReservedStaking": 0,
        "ReservedStakingRevocation": 0,
        "ReservedWithdrawal": 0
      },
      "isNative": true,
      "name": "PCX"
    },
    {
      "details": {
        "Free": 1000000000,
        "ReservedDexFuture": 0,
        "ReservedDexSpot": 0,
        "ReservedStaking": 0,
        "ReservedStakingRevocation": 0,
        "ReservedWithdrawal": 0
      },
      "isNative": false,
      "name": "BTC"
    }
  ],
  "pageIndex": 0, //当前页码
  "pageSize": 10, //页大小
  "pageTotal": 1 //总共页数
}
**/
```

### chainx.asset.getAssets([page_index](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js), [page_size](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js))

总资产信息

### 参数

- `page_index`：u32 页码 (从0开始)
- `page_size`：u32 页大小 (<=100)

### 例子

```js
chainx.asset.getAssets(0, 10)
/**
{
  "data": [
    // 资产列表
    {
      "chain": "ChainX",
      "desc": "PCX onchain token",
      "details": {
        // key 是 资产类别的 枚举
        "Free": 2000000000, // 总活动资产数目
        "ReservedDexFuture": 0, // 总期货交易锁定资产数目
        "ReservedDexSpot": 0, // 总交易锁定资产数目
        "ReservedStaking": 0, // 总投票锁定资产数目
        "ReservedStakingRevocation": 0, // 总投票赎回锁定资产数目
        "ReservedWithdrawal": 0 // 总提现锁定数目
      },
      "isNative": true, // 是否是 native 资产
      "name": "PCX", // token id, token 标示
      "precision": 3,
      "trusteeAddr": ""
    },
    {
      "chain": "Bitcoin",
      "desc": "BTC chainx",
      "details": {
        "Free": 2000000000,
        "ReservedDexFuture": 0,
        "ReservedDexSpot": 0,
        "ReservedStaking": 0,
        "ReservedStakingRevocation": 0,
        "ReservedWithdrawal": 0
      },
      "isNative": false,
      "name": "BTC",
      "precision": 8,
      "trusteeAddr": "2MtAUgQmdobnz2mu8zRXGSTwUv9csWcNwLU" //接收跨链转账的信托地址
    }
  ],
  "pageIndex": 0, //当前页码
  "pageSize": 10, //页大小
  "pageTotal": 1 //总共页数
}

**/
```

### chainx.asset.getWithdrawalList([chain](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Chain.js), [page_index](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js), [page_size](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js))

当前所有提现中记录

### 参数

- `chain`: String 链ID 枚举[“ChainX”, “Bitcoin”, “Ethereum”, “Polkadot”]
- `page_index`: u32 页码 (从0开始)
- `page_size`: u32 页大小 (<=100)

### 例子

```js
chainx.asset.getWithdrawalList('Bitcoin', 0, 10)
/**
{
  "data": [
    {
      "address": "mjKE11gjVN4JaC9U8qL6ZB5vuEBgmwik7b", // 提现地址
      "accountid": "0xd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f", // 提现申请人
      "balance": 10, // 提现金额
      "memo": "", // 提现备注 或其他
      "id": 0, // 提现序列号
      "status": "Applying", // 当前提现状态，[枚举类型] 当前有3个值 "Applying" 申请中,"Signing" 签名中, "Broadcasting" 广播中, "Processing"处理中
      "time": 1547536602, // 申请提现的时间
      "token": "BTC", // 提现资产名
      "txid": "" //交易id
    },
    {
      "address": "mjKE11gjVN4JaC9U8qL6ZB5vuEBgmwik7b",
      "accountid": "0xd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f",
      "balance": 10,
      "memo": "",
      "id": 1,
      "status": "Applying",
      "time": 1547536652,
      "token": "BTC",
      "txid": ""
    }
  ],
  "pageIndex": 0, // 同上
  "pageSize": 100,
  "pageTotal": 1
}
**/
```

### chainx.asset.getWithdrawalListByAccount([who](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Address.js), [page_index](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js), [page_size](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js))

当前用户的提现中记录

### 参数

- `who`: AccountId 账户
- `page_index`: u32 页码 (从0开始)
- `page_size`: u32 页大小 (<=100)

### 例子

```js
chainx.asset.getWithdrawalListByAccount('5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ', 0, 10)
/**
与 chainx.asset.getWithdrawalList 返回值相同
**/
```

### chainx.asset.getDepositList([chain](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Chain.js), [page_index](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js), [page_size](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js))

充值中列表

### 参数

- `chain`: String 链ID 枚举[“ChainX”, “Bitcoin”, “Ethereum”, “Polkadot”]
- `page_index`: u32 页码 (从0开始)
- `page_size`: u32 页大小 (<=100)

### 例子

```js
chainx.asset.getDepositList('Bitcoin', 0, 10)
/**
{
  "data": [
    {
      "accountid": "", //chainx账户
      "address": "mfioc8QgfcTVwuVd787JrdHMVjHACFWGX7", //btc地址
      "balance": 1000, //充值金额
      "confirm": 1, //确认数
      "memo": "", //备注
      "time": 1547003949, //时间戳
      "token": "BTC", //币种
      "totalConfirm": 3, //总确认数
      "txid": "20bf6f637c0f05dbf2936cb0dbdd365ef1292e166aa7ed8af8d6c8418850d58e" //btc交易id
    },
    {
      "accountid": "",
      "address": "mfioc8QgfcTVwuVd787JrdHMVjHACFWGX7",
      "balance": 2000,
      "confirm": 2,
      "memo": "",
      "time": 1547003080,
      "token": "BTC",
      "totalConfirm": 3,
      "txid": "4f0c8ebd3650f6e369a4b400330ffb579c9d163cd0fcea0d065644acff571dd9"
    }
  ],
  "pageIndex": 0,
  "pageSize": 3,
  "pageTotal": 1
}
**/
```

### chainx.asset.getAddressByAccount([who](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Address.js), [chain](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Chain.js))

ChainX账户绑定BTC地址列表

### 参数

- `who`: AccountId 账户
- `chain`: String 链ID 枚举[“ChainX”, “Bitcoin”, “Ethereum”, “Polkadot”]

### 例子

```js
chainx.asset.getAddressByAccount('5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ', 'Bitcoin')
/**
[
  "mfioc8QgfcTVwuVd787JrdHMVjHACFWGX7"
]
**/
```

### chainx.asset.getWithdrawTx([chain](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Chain.js))

获取提现交易

### 参数

- chain: Chain, 链ID

### 例子

```js
chainx.asset.getWithdrawTx('Bitcoin')
/**
{
  "redeemScript": "532103f72c448a0e59f48d4adef86cba7b278214cece8e56ef32ba1d179e0a8129bdba210306117a360e5dbe10e1938a047949c25a86c0b0e08a0a7c1e611b97de6b2917dd210311252930af8ba766b9c7a6580d8dc4bbf9b0befd17a8ef7fabac275bba77ae40210227e54b65612152485a812b8856e92f41f64788858466cc4d8df674939a5538c354ae", //redeem_script
  "signStatus": false, //签名状态： false 未签名完成， true 签名完成
  "tx": "0100000001283fe241ec9528a48e6ce79b1ede9aabb59dbe38edeee013a28744c31d3db7860000000000ffffffff0288130000000000001976a914a5155d5636db0a9b8314460812f5105d84a5ae3d88acf0d200000000000017a9145737c1979343920ceea40e7c7d68b264b0effa3e8700000000" //交易原文
}

**/
```

### chainx.stake.getNominationRecords([who](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Address.js))

用户投票信息

### 参数

- `who`: AccountId 账户

### 例子

```js
chainx.stake.getNominationRecords('5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ')
/**
[
  [
    "0x9886b933e38461399f5997ef162b1ef90f8bcb19d3a2f256be0a8d2f85a80d98", // 投票节点
    {
      "lastVoteWeight": 26000, // 票龄
      "lastVoteWeightUpdate": 3461, // 票龄更新高度
      "nomination": 600, // 投票金额
      "revocations": [
        {
          "blockNumer": 117,
          "value": 1
        }
      ] // 撤票记录，117 为可赎回高度，1 为届时的可赎回金额
    }
  ]
]
**/
```

### chainx.stake.getIntentions()

节点列表

### 参数

无

### 例子

```js
chainx.stake.getNominationRecords()
/**
[
  {
    "about": "", // 关于
    "account": "0xd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f", // 账户 ID
    "isActive": true, // 是否参选
    "isTrustee": true, // 是否是信托节点
    "isValidator": true, // 是否是结算节点
    "jackpot": 387096776, // 奖池金额
    "jackpotAddress": "0xce153e3235448f29ca9052a660e36abd9b9fdc72f80a4059a2427ff06b1a3706", // 奖池地址
    "lastTotalVoteWeight": 0, // 总票龄
    "lastTotalVoteWeightUpdate": 0, // 总票龄更新时间
    "name": "Alice", // 节点名
    "selfVote": 1250000000, // 节点自投票
    "sessionKey": "0xd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f", // 节点出块地址， 类型为 AccountId
    "totalNomination": 1250000000, // 节点总投票
    "url": "Alice.com" // 节点网址
  }
]

**/
```

### chainx.stake.getPseduIntentions()

充值挖矿列表

### 参数

无

### 例子

```js
chainx.stake.getPseduIntentions()
/**
[
  {
    "circulation": 2000000000, // 总发行量
    "id": "BTC", // 资产ID
    "jackpot": 0, // 奖池金额
    "lastTotalDepositWeight": 0, // 总票龄
    "lastTotalDepositWeightUpdate": 0, // 总票龄更新高度
    "power": 10000000, // 单位资产对PCX算力
    "price": 1000000000 // 单位资产对PCX移动均价
  }
]
**/
```

### chainx.stake.getPseduNominationRecords([who](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Address.js))

用户投票信息

### 参数

- `who`: AccountId 账户

### 例子

```js
chainx.stake.getPseduNominationRecords('5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ')
/**
[
  {
    "balance": 1000000000, // 投票金额
    "id": "BTC", // 资产 ID
    "lastTotalDepositWeight": 0, // 票龄
    "lastTotalDepositWeightUpdate": 0 // 票龄更新高度
  }
]

**/
```

### chainx.stake.getTrusteeInfoByAccount([who](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Address.js))

用户投票信息

### 参数

- `who`: AccountId 账户

### 例子

```js
chainx.stake.getTrusteeInfoByAccount('5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ')
/**
[
  {
    "chain": "Bitcoin", // 链 ID
    "coldEntity": "02a79800dfed17ad4c78c52797aa3449925692bc8c83de469421080f42d27790ee", // 冷公钥/地址
    "hotEntity": "03f72c448a0e59f48d4adef86cba7b278214cece8e56ef32ba1d179e0a8129bdba" // 热公钥/地址
  }
]
**/
```

### chainx.stake.getBondingDuration()

获取普通用户撤销投票的锁定期，

### 参数

无

### 例子

```js
chainx.stake.getBondingDuration()
/**
300 //300 个块
**/
```

### chainx.stake.getIntentionBondingDuration()

获取节点用户撤销投票的锁定期

### 参数

无

### 例子

```js
chainx.stake.getIntentionBondingDuration()
/**
3000 //3000 个块
**/
```

### chainx.stake.getNextKeyFor([who](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Address.js))

获取节点出块地址

### 参数

- `who`: AccountId 账户

### 例子

```js
chainx.stake.getNextKeyFor('5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ')
/**
5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ
**/
```

### chainx.stake.getTokenDiscount()

获取虚拟挖矿的折扣

### 参数

无

### 例子

```js
chainx.stake.getNextKeyFor()
/**
10
**/
```

### chainx.trade.getOrderPairs()

交易对列表

### 参数

无

### 例子

```js
chainx.trade.getOrderPairs()
/**
[
  {
    "assets": "PCX", //交易对first
    "currency": "BTC", //交易对second
    "id": 0, //交易对的ID
    "precision": 5, //交易对价格精度 10.pow(precision)
    "used": true //交易对状态 上线||下线
  }
]
**/
```

### chainx.trade.getQuotations([id](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js), [piece](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js))

交易对报价列表

### 参数

- `id`:`OrderPairID` 从`chainx.trade.getOrderPairs`接口中返回的交易对ID
- `piece`:`u32` ?档 必须<=10

### 例子

```js
chainx.trade.getQuotations(0,10)
/**
{
  "buy": [
    //买N档
    [
      100000, //价格
      20 //数量
    ]
  ],
  "id": 0, //交易对ID
  "piece": 10, //N档
  "sell": [] //卖N档
}
**/
```

### chainx.trade.getOrders([who](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/Address.js), [page_index](https://github.com/chainx-org/chainx.js/blob/master/packages/types/src/U32.js), [page_size]())

用户挂单列表

### 参数

- `who`: AccountId 账户
- `page_index`: u32 页码 (从0开始)
- `page_size`: u32 页大小 (<=100)

### 例子

```js
chainx.trade.getOrders('5FxL27izsvhViiQtgwBm6kP8XvMSZ3JjyoMCmaw7pGrgXqqJ', 0, 10)
/**
{
  "data": [
    {
      "amount": 40, //数量
      "class": "Limit", //订单类型（限价单|市价单)
      "createTime": 1547551914, //创建时间戳
      "direction": "Buy", //订单方向（卖|买）
      "fillIndex": [], //成交ID
      "hasfillAmount": 0, //已成交数量
      "index": 2, //订单编号
      "lastupdateTime": 1547551914, //最后更新时间戳
      "pair": 0, //交易对ID
      "price": 100000, //价格
      "reserveLast": 4000000, //锁定数量（若是卖，则是assets的数量）
      "status": "FillNo",
      //订单状态 (FillNo,FillPart,FillAll,FillPartAndCancel,Cancel)
      "user": "0xd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f" //用户账户
    }
  ],
  "pageIndex": 0, //当前页码
  "pageSize": 100, //页大小
  "pageTotal": 1 //总共页数
}

**/
```



## 扩展
