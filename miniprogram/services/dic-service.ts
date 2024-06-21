import { fetch, objectToQueryString } from './fetch'

/**
 * 字典服务
 */
const _serviceName = '/admin-api/dict/data';

/**
 * 系统字典列表
 */
const getAllPromise: Promise<any> = fetch({
  url: `${_serviceName}/list`,
  method: 'GET'
});

/**
 * 获取列表
 */
const getAll: any = () => {
  // 参数处理
  return getAllPromise;
}

export default {
  getAll
}