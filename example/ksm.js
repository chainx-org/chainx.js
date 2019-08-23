require('dotenv').config();

const { ApiPromise, WsProvider } = require('@polkadot/api');
const provider = new WsProvider(process.env.KUSAMA_WS_ADDR);
const { Keyring } = require('@polkadot/keyring');

const keyring = new Keyring();
// const pair = keyring.addFromMnemonic(process.env.KUSAMA_SOURCE_KEY);
const pair = keyring.addFromUri('//Alice');

async function getApi() {
  console.log('will create api');
  const api = await ApiPromise.create(provider);
  return api;
}

module.exports = { getApi, pair };
