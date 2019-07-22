export default class Trustee {
  constructor(chainx) {
    this.api = chainx.api;
  }

  getTrusteeSessionInfo = (...args) => {
    return this.api.rpc.chainx.getTrusteeSessionInfo(...args);
  };

  getDepositLimitByToken = (...args) => {
    return this.api.rpc.chainx.getDepositLimitByToken(...args);
  };

  getTrusteeInfoByAccount = (...args) => {
    return this.api.rpc.chainx.getTrusteeInfoByAccount(...args);
  };

  getWithdrawTx = (...args) => {
    return this.api.rpc.chainx.getWithdrawTx(...args);
  };

  /**
   * MultiSigAddrInfo
   */
  getMultiSigAddrInfo = (...args) => {
    return this.api.query.xMultiSig.multiSigAddrInfo(...args).then(result => (result ? result.toJSON() : undefined));
  };

  /**
   * PendingListFor
   */
  getPendingListFor = async accountId => {
    const pendingList = await this.api.query.xMultiSig.pendingListFor(accountId);
    return Promise.all(
      pendingList.toJSON().map(hash => {
        return this.api.query.xMultiSig.pendingStateFor([accountId, hash]).then(result => {
          return { proposalId: hash, ...result.toJSON(), trustee: accountId };
        });
      })
    );
  };

  createWithdrawTx = (withdrawalIdList, tx) => {
    return this.api.tx.xBridgeOfBtc.createWithdrawTx(withdrawalIdList, tx);
  };

  signWithdrawTx = tx => {
    return this.api.tx.xBridgeOfBtc.signWithdrawTx(tx);
  };

  transitionTrusteeSession = (chain, new_trustees) => {
    return this.api.tx.xBridgeFeatures.transitionTrusteeSession(chain, new_trustees);
  };

  removeMultiSigFor = (multi_sig_addr, multi_sig_id) => {};

  /**
   * 设置信托
   */
  setupBitcoinTrustee = (about, hotEntity, coldEntity) => {
    return this.api.tx.xBridgeFeatures.setupBitcoinTrustee(about, hotEntity, coldEntity);
  };
}
