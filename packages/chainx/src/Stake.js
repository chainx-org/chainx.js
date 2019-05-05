export default class Stake {
  constructor(chainx) {
    this.api = chainx.api;
  }

  getNominationRecords = (...args) => {
    return this.api.rpc.chainx.getNominationRecords(...args);
  };

  getIntentions = (...args) => {
    return this.api.rpc.chainx.getIntentions(...args);
  };

  getPseduIntentions = (...args) => {
    return this.api.rpc.chainx.getPseduIntentions(...args);
  };

  getPseduNominationRecords = (...args) => {
    return this.api.rpc.chainx.getPseduNominationRecords(...args);
  };

  getBondingDuration = () => {
    return this.api.query.xStaking.bondingDuration().then(result => result.toJSON());
  };

  getIntentionBondingDuration = () => {
    return this.api.query.xStaking.intentionBondingDuration().then(result => result.toJSON());
  };

  getNextKeyFor = address => {
    return this.api.query.session.nextKeyFor(address).then(result => (result.length ? result.toJSON() : undefined));
  };

  getTrusteeInfoByAccount = (...args) => {
    return this.api.rpc.chainx.getTrusteeInfoByAccount(...args);
  };

  /**
   * 注册节点
   * https://github.com/chainpool/ChainX/blob/develop/xrml/xmining/staking/src/lib.rs#L237
   */
  register = name => {
    return this.api.tx.xstaking.register(name);
  };

  /**
   * 投票
   * https://github.com/chainpool/ChainX/blob/develop/xrml/xmining/staking/src/lib.rs#L107
   */
  nominate = (target, value, memo) => {
    return this.api.tx.xstaking.nominate(target, value, memo);
  };

  /**
   * 取消投票
   * https://github.com/chainpool/ChainX/blob/develop/xrml/xmining/staking/src/lib.rs#L130
   */
  unnominate = (target, value, memo) => {
    return this.api.tx.xstaking.unnominate(target, value, memo);
  };

  /**
   * 更新节点信息
   * https://github.com/chainpool/ChainX/blob/develop/xrml/xmining/staking/src/lib.rs#L207
   */
  refresh = (url, desireToRun, nextKey, about) => {
    return this.api.tx.xstaking.refresh(url, desireToRun, nextKey, about);
  };

  /**
   * 投票提息
   * https://github.com/chainpool/ChainX/blob/develop/xrml/xmining/staking/src/lib.rs#L207
   */
  voteClaim = target => {
    return this.api.tx.xstaking.claim(target);
  };

  /**
   * 充值挖矿提息
   * https://github.com/chainpool/ChainX/blob/develop/xrml/xmining/tokens/src/lib.rs#L186
   */
  depositClaim = token => {
    return this.api.tx.xtokens.claim(token);
  };

  /**
   * 解除冻结
   * https://github.com/chainpool/ChainX/blob/develop/xrml/xmining/staking/src/lib.rs#L165
   */
  unfreeze = (target, revocationIndex) => {
    return this.api.tx.xstaking.unfreeze(target, revocationIndex);
  };

  /**
   * 设置信托
   */
  setupBitcoinTrustee = (about, hotEntity, coldEntity) => {
    return this.api.tx.xbridgeFeatures.setupBitcoinTrustee(about, hotEntity, coldEntity);
  };

  /**
   * 切换投票
   */
  renominate = (from, to, value, memo) => {
    return this.api.tx.xstaking.renominate(from, to, value, memo);
  };
}
