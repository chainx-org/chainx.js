const { ApiBase, HttpProvider, WsProvider } = require('chainx.js');

(async () => {
  // 使用 http 连接（不能订阅）
  const api = new ApiBase(new HttpProvider('https://w1.chainx.org/rpc'));
  // 使用 websocket 连接
  // const api = new ApiBase(new WsProvider('wss://w1.chainx.org/ws'))

  await api.isReady;

  async function queryTimeStamp(blockNumber) {
    const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
    const time = await api.query.timestamp.now.at(blockHash);
    return time.toNumber();
  }

  console.log('时间戳：', await queryTimeStamp(2));
})();
