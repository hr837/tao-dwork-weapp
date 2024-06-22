import { fetch, objectToQueryString } from './fetch'

/**
 * 字典服务
 */
const _serviceName = '/admin-api/dict';

/**
 * 获取列表
 */
const getAll: any = () => {
  const tenantId = wx.getStorageSync('tenant_id');
  // 参数处理
  return fetch({
    url: `${_serviceName}/type/dropDownCache?tenant-id=${tenantId ? tenantId : 1}`,
    method: 'GET'
  });
}

export default {
  getAll
}