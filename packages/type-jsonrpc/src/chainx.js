/**
 * chainx rpc 调用
 */

import createMethod from './create/method';
import createParam from './create/param';

const getBlockByNumber = {
  description: '',
  params: [createParam('blockNumber', 'BlockNumber', { isOptional: true })],
  type: 'RawJSON',
};

const getCertByAccount = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getAssetsByAccount = {
  description: '',
  params: [
    createParam('accountId', 'PublicKey'),
    createParam('u32', 'u32'),
    createParam('u32', 'u32'),
    createParam('hash', 'Hash', { isOptional: true }),
  ],
  type: 'RawJSON',
};

const getAssets = {
  description: '',
  params: [createParam('u32', 'u32'), createParam('u32', 'u32'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

// @todo xrecords 类型
const getVerifyAddress = {
  description: '',
  params: [
    createParam('xassets', 'Token'),
    createParam('xrecords', 'Text'),
    createParam('xassets', 'Memo'),
    createParam('hash', 'Hash', { isOptional: true }),
  ],
  type: 'RawJSON',
};

const getWithdrawalList = {
  description: '',
  params: [
    createParam('chain', 'Chain'),
    createParam('u32', 'u32'),
    createParam('u32', 'u32'),
    createParam('hash', 'Hash', { isOptional: true }),
  ],
  type: 'RawJSON',
};

const getWithdrawalListByAccount = {
  description: '',
  params: [
    createParam('accountId', 'PublicKey'),
    createParam('u32', 'u32'),
    createParam('u32', 'u32'),
    createParam('hash', 'Hash', { isOptional: true }),
  ],
  type: 'RawJSON',
};

const getNominationRecords = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getNominationRecordsV1 = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getIntentions = {
  description: '',
  params: [createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getIntentionsV1 = {
  description: '',
  params: [createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getIntentionByAccount = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getIntentionByAccountV1 = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getPseduIntentions = {
  description: '',
  params: [createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getPseduIntentionsV1 = {
  description: '',
  params: [createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getPseduNominationRecords = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getPseduNominationRecordsV1 = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getTradingPairs = {
  description: '',
  params: [createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getQuotations = {
  description: '',
  params: [
    createParam('tradingPairIndex', 'TradingPairIndex'),
    createParam('u32', 'u32'),
    createParam('hash', 'Hash', { isOptional: true }),
  ],
  type: 'RawJSON',
};

const getOrders = {
  description: '',
  params: [
    createParam('accountId', 'PublicKey'),
    createParam('u32', 'u32'),
    createParam('u32', 'u32'),
    createParam('hash', 'Hash', { isOptional: true }),
  ],
  type: 'RawJSON',
};

const getDepositList = {
  description: '',
  params: [
    createParam('chain', 'Chain'),
    createParam('u32', 'u32'),
    createParam('u32', 'u32'),
    createParam('hash', 'Hash', { isOptional: true }),
  ],
  type: 'RawJSON',
};

const getAddressByAccount = {
  description: '',
  params: [
    createParam('accountId', 'PublicKey'),
    createParam('chain', 'Chain'),
    createParam('hash', 'Hash', { isOptional: true }),
  ],
  type: 'RawJSON',
};

const getTrusteeInfoByAccount = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const verifyAddressValidity = {
  description: '',
  params: [
    createParam('string', 'Text'),
    createParam('string', 'Text'),
    createParam('string', 'Text'),
    createParam('hash', 'Hash', { isOptional: true }),
  ],
  type: 'RawJSON',
};

const getFeeByCallAndLength = {
  description: '',
  params: [
    createParam('string', 'Text'),
    createParam('length', 'u64'),
    createParam('hash', 'Hash', { isOptional: true }),
  ],
  type: 'RawJSON',
};

const getWithdrawTx = {
  description: '',
  params: [createParam('chain', 'Chain'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getTrusteeSessionInfo = {
  description: '',
  params: [
    createParam('chain', 'Chain'),
    createParam('u32', 'U32', { isOptional: true }),
    createParam('hash', 'Hash', { isOptional: true }),
  ],
  type: 'RawJSON',
};

const getDepositLimitByToken = {
  description: '',
  params: [createParam('chain', 'Chain'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getWithdrawalLimitByToken = {
  description: '',
  params: [createParam('token', 'Token'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const particularAccounts = {
  description: '',
  params: [],
  type: 'RawJSON',
};

const getNextRenominateByAccount = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getFeeWeightMap = {
  description: '',
  params: [],
  type: 'RawJSON',
};

const getStakingDividendByAccount = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getCrossMiningDividendByAccount = {
  description: '',
  params: [createParam('accountId', 'PublicKey'), createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const getExtrinsicsEventsByBlockHash = {
  description: '',
  params: [createParam('hash', 'Hash', { isOptional: true })],
  type: 'RawJSON',
};

const contractCall = {
  description: '',
  params: [createParam('callRequest', 'ContractCallRequest'), createParam('at', 'Hash', { isOptional: true })],
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
    getNominationRecordsV1: createMethod(section, 'getNominationRecordsV1', getNominationRecordsV1),
    getIntentions: createMethod(section, 'getIntentions', getIntentions),
    getIntentionsV1: createMethod(section, 'getIntentionsV1', getIntentionsV1),
    getIntentionByAccount: createMethod(section, 'getIntentionByAccount', getIntentionByAccount),
    getIntentionByAccountV1: createMethod(section, 'getIntentionByAccountV1', getIntentionByAccountV1),
    getPseduIntentions: createMethod(section, 'getPseduIntentions', getPseduIntentions),
    getPseduIntentionsV1: createMethod(section, 'getPseduIntentionsV1', getPseduIntentionsV1),
    getPseduNominationRecords: createMethod(section, 'getPseduNominationRecords', getPseduNominationRecords),
    getPseduNominationRecordsV1: createMethod(section, 'getPseduNominationRecordsV1', getPseduNominationRecordsV1),
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
    getDepositLimitByToken: createMethod(section, 'getDepositLimitByToken', getDepositLimitByToken),
    particularAccounts: createMethod(section, 'particularAccounts', particularAccounts),
    getNextRenominateByAccount: createMethod(section, 'getNextRenominateByAccount', getNextRenominateByAccount),
    getFeeWeightMap: createMethod(section, 'getFeeWeightMap', getFeeWeightMap),
    getStakingDividendByAccount: createMethod(section, 'getStakingDividendByAccount', getStakingDividendByAccount),
    getExtrinsicsEventsByBlockHash: createMethod(
      section,
      'getExtrinsicsEventsByBlockHash',
      getExtrinsicsEventsByBlockHash
    ),
    getCrossMiningDividendByAccount: createMethod(
      section,
      'getCrossMiningDividendByAccount',
      getCrossMiningDividendByAccount
    ),
    contractCall: createMethod(section, 'contractCall', contractCall),
  },
};
