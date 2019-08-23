// 用于不断提交Kusama转账交易，并更新数据库状态
const { getApi } = require('./ksm');

(async function() {
  const ksmApi = await getApi();
})();
