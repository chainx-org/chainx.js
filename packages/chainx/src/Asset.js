export default class Asset {
  constructor(chainx) {
    this.api = chainx.api;
  }

  getAssetsByAccount = (...args) => {
    return this.api.rpc.chainx.getAssetsByAccount(...args);
  };

  getAssets = (...args) => {
    return this.api.rpc.chainx.getAssets(...args);
  };

  getWithdrawalList = (...args) => {
    return this.api.rpc.chainx.getWithdrawalList(...args);
  };

  getWithdrawalListByAccount = (...args) => {
    return this.api.rpc.chainx.getWithdrawalListByAccount(...args);
  };

  getDepositList = (...args) => {
    return this.api.rpc.chainx.getDepositList(...args);
  };

  verifyAddressValidity = (...args) => {
    return this.api.rpc.chainx.verifyAddressValidity(...args);
  };

  getAccountByBTCAddress = (...args) => {
    return this.api.rpc.chainx.getAccountByBTCAddress(...args);
  };

  getAddressByAccount = (...args) => {
    return this.api.rpc.chainx.getAddressByAccount(...args);
  };

  getTrusteeSessionInfo = Chain => {
    return this.api.rpc.chainx.getTrusteeSessionInfo(Chain);
  };

  getWithdrawTx = Chain => {
    return this.api.rpc.chainx.getWithdrawTx(Chain);
  };

  getMinimalWithdrawalValueByToken = token => {
    return this.api.rpc.chainx.getMinimalWithdrawalValueByToken(token);
  };

  /**
   * https://github.com/chainpool/ChainX/blob/develop/xrml/xassets/assets/src/lib.rs#L146
   */
  transfer = (dest, token, value, memo) => {
    return this.api.tx.xassets.transfer(dest, token, value, memo);
  };

  /**
   * https://github.com/chainpool/ChainX/blob/develop/xrml/xassets/process/src/lib.rs#L63
   */
  withdraw = (token, value, addr, ext) => {
    return this.api.tx.xprocess.withdraw(token, value, addr, ext);
  };

  revokeWithdraw = id => {
    return this.api.tx.xprocess.revokeWithdraw(id);
  };

  createWithdrawTx = (withdrawalIdList, tx) => {
    return this.api.tx.xbitcoin.createWithdrawTx(withdrawalIdList, tx);
  };

  signWithdrawTx = tx => {
    return this.api.tx.xbitcoin.signWithdrawTx(tx);
  };

  claimSdot = (ethereumSignature, signData, inputData) => {
    return this.api.tx.xsdot.claim(ethereumSignature, signData, inputData);
  };
}
