/**
 * chainx rpc 调用
 */

import createMethod from './create/method';
import createParam from './create/param';

const getBlockByNumber = {
  description: '',
  params: [createParam('number', 'Number', { isOptional: true })],
  type: 'RawJSON',
};

const getCertByAccount = {
  description: '',
  params: [createParam('accountId', 'PublicKey')],
  type: 'RawJSON',
};

const getAssetsByAccount = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('u32', 'u32'), createParam('u32', 'u32')],
  type: 'RawJSON',
};

const getAssets = {
  description: '',
  params: [createParam('u32', 'u32'), createParam('u32', 'u32')],
  type: 'RawJSON',
};

// @todo xrecords 类型
const getVerifyAddress = {
  description: '',
  params: [createParam('xassets', 'Token'), createParam('xrecords', 'Text'), createParam('xassets', 'Memo')],
  type: 'RawJSON',
};

const getWithdrawalList = {
  description: '',
  params: [createParam('chain', 'Chain'), createParam('u32', 'u32'), createParam('u32', 'u32')],
  type: 'RawJSON',
};

const getWithdrawalListByAccount = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('u32', 'u32'), createParam('u32', 'u32')],
  type: 'RawJSON',
};

const getNominationRecords = {
  description: '',
  params: [createParam('accountId', 'PublicKey')],
  type: 'RawJSON',
};

const getIntentions = {
  description: '',
  params: [],
  type: 'RawJSON',
};

const getIntentionsByAccount = {
  description: '',
  params: [createParam('accountId', 'PublicKey')],
  type: 'RawJSON',
};

const getPseduIntentions = {
  description: '',
  params: [],
  type: 'RawJSON',
};

const getPseduNominationRecords = {
  description: '',
  params: [createParam('accountId', 'PublicKey')],
  type: 'RawJSON',
};

const getTradingPairs = {
  description: '',
  params: [],
  type: 'RawJSON',
};

const getQuotations = {
  description: '',
  params: [createParam('tradingPairIndex', 'TradingPairIndex'), createParam('u32', 'u32')],
  type: 'RawJSON',
};

const getOrders = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('u32', 'u32'), createParam('u32', 'u32')],
  type: 'RawJSON',
};

const getDepositList = {
  description: '',
  params: [createParam('chain', 'Chain'), createParam('u32', 'u32'), createParam('u32', 'u32')],
  type: 'RawJSON',
};

const getAddressByAccount = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('chain', 'Chain')],
  type: 'RawJSON',
};

const getTrusteeInfoByAccount = {
  description: '',
  params: [createParam('accountId', 'PublicKey')],
  type: 'RawJSON',
};

const verifyAddressValidity = {
  description: '',
  params: [createParam('string', 'Text'), createParam('string', 'Text'), createParam('string', 'Text')],
  type: 'RawJSON',
};

const getFeeByCallAndLength = {
  description: '',
  params: [createParam('string', 'Text'), createParam('length', 'u64')],
  type: 'RawJSON',
};

const getWithdrawTx = {
  description: '',
  params: [createParam('chain', 'Chain')],
  type: 'RawJSON',
};

const getTrusteeSessionInfo = {
  description: '',
  params: [createParam('chain', 'Chain')],
  type: 'RawJSON',
};

const getWithdrawalLimitByToken = {
  description: '',
  params: [createParam('token', 'Token')],
  type: 'RawJSON',
};

const section = 'chainx';

/**
 * @summary Methods to retrieve chain data.
 */
export default {
  isDeprecated: false,
  isHidden: false,
  description: 'chainx rpc',
  section,
  methods: {
    getBlockByNumber: createMethod(section, 'getBlockByNumber', getBlockByNumber),
    getCertByAccount: createMethod(section, 'getCertByAccount', getCertByAccount),
    getAssetsByAccount: createMethod(section, 'getAssetsByAccount', getAssetsByAccount),
    getAssets: createMethod(section, 'getAssets', getAssets),
    getVerifyAddress: createMethod(section, 'getVerifyAddress', getVerifyAddress),
    getWithdrawalList: createMethod(section, 'getWithdrawalList', getWithdrawalList),
    getWithdrawalListByAccount: createMethod(section, 'getWithdrawalListByAccount', getWithdrawalListByAccount),
    getNominationRecords: createMethod(section, 'getNominationRecords', getNominationRecords),
    getIntentions: createMethod(section, 'getIntentions', getIntentions),
    getIntentionsByAccount: createMethod(section, 'getIntentionsByAccount', getIntentionsByAccount),
    getPseduIntentions: createMethod(section, 'getPseduIntentions', getPseduIntentions),
    getPseduNominationRecords: createMethod(section, 'getPseduNominationRecords', getPseduNominationRecords),
    getTradingPairs: createMethod(section, 'getTradingPairs', getTradingPairs),
    getQuotations: createMethod(section, 'getQuotations', getQuotations),
    getOrders: createMethod(section, 'getOrders', getOrders),
    getDepositList: createMethod(section, 'getDepositList', getDepositList),
    getAddressByAccount: createMethod(section, 'getAddressByAccount', getAddressByAccount),
    getTrusteeInfoByAccount: createMethod(section, 'getTrusteeInfoByAccount', getTrusteeInfoByAccount),
    verifyAddressValidity: createMethod(section, 'verifyAddressValidity', verifyAddressValidity),
    getFeeByCallAndLength: createMethod(section, 'getFeeByCallAndLength', getFeeByCallAndLength),
    getWithdrawTx: createMethod(section, 'getWithdrawTx', getWithdrawTx),
    getTrusteeSessionInfo: createMethod(section, 'getTrusteeSessionInfo', getTrusteeSessionInfo),
    getWithdrawalLimitByToken: createMethod(section, 'getWithdrawalLimitByToken', getWithdrawalLimitByToken),
  },
};
