import { fetch, objectToQueryString } from './fetch'

/**
 * 货源服务
 */
const _serviceName = '/api/org';

/**
 * 获取列表
 */
const getAll: any = () => {
  // 参数处理

  return fetch({
    url: `${_serviceName}/getAll`,
    method: 'GET'
  });
}

/**
 * 获取列表
 */
const getKeyValue: any = () => {
  // 参数处理

  return fetch({
    url: `${_serviceName}/getKeyValue`,
    method: 'GET'
  });
}

export default {
  getAll,
  getKeyValue,
}