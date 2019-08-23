const { ApiPromise, WsProvider } = require('@polkadot/api');
const provider = new WsProvider('ws://140.82.35.183:9944');
ApiPromise.create(provider);
