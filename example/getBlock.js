const { ApiBase, HttpProvider, WsProvider } = require('chainx.js');

(async () => {
  // 使用 http 连接
  const api = new ApiBase(new WsProvider('ws://39.105.37.131:8087'));
  // 使用 websocket 连接
  // const api = new ApiBase(new WsProvider('wss://w1.chainx.org/ws'))

  await api.isReady;

  async function getTransfers(blockNumber) {
    const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
    const block = await api.rpc.chain.getBlock(blockHash);
    const estrinsics = block.block.extrinsics;
    const transfers = [];

    for (let i = 0; i < estrinsics.length; i++) {
      const e = estrinsics[i];

      const allEvents = await api.query.system.events.at(blockHash);
      events = allEvents
        .filter(({ phase }) => phase.type === 'ApplyExtrinsic' && phase.value.eqn(i))
        .map(event => {
          const o = event.toJSON();
          o.method = event.event.data.method;
          return o;
        });
      result = events[events.length - 1].method;

      transfers.push({
        index: i,
        blockHash: blockHash.toHex(),
        blockNumber: blockNumber,
        result,
        tx: {
          signature: e.signature.toJSON(),
          method: e.method.toJSON(),
        },
        events: events,
        txHash: e.hash.toHex(),
      });
    }

    return transfers;
  }

  const transfers = await getTransfers(35689);

  // websocket 断开连接
  // api.provider.disConnect()
  console.log(JSON.stringify(transfers));
})();
