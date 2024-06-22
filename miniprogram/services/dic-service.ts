import { fetch, objectToQueryString } from './fetch'

/**
 * 字典服务
 */
const _serviceName = '/admin-api/dict';

/**
 * 获取列表
 */
const getAll: any = () => {
  // 参数处理
  return fetch({
    url: `${_serviceName}/type/dropDownCache`,
    method: 'GET'
  });
}

export default {
  getAll
}