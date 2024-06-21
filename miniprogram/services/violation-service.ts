import { fetch, objectToQueryString } from './fetch'

/**
 * 违规违纪服务
 */
const _serviceName = '/api/violation';

/**
 * 获取分页列表
 * @param _params 分页查询参数
 */
const getPaged: Function = (_params: any): Promise<any> => {
  //参数处理
  const _queryString = objectToQueryString(_params);
  return fetch({
    url: `${_serviceName}?${_queryString}`,
    method: 'GET'
  });
}

/**
 * 新增
 * @param _params 模型
 */
const add: Function = (_params: any): Promise<any> => {
  return fetch({
    url: `${_serviceName}`,
    params: _params,
    method: 'POST'
  });
}

/**
 * 更新信息
 * @param id ID
 * @param _params 模型
 */
const update: Function = (id: any, _params: any): Promise<any> => {
  return fetch({
    url: `${_serviceName}/${id}`,
    params: _params,
    method: 'PUT'
  });
}

/**
 * 删除
 * @param id ID
 */
const remove: Function = (_params: any): Promise<any> => {
  return fetch({
    url: `${_serviceName}`,
    parans: _params,
    method: 'DELETE'
  });
}

/**
 *获取详情
 *@param id ID
 */
const details: Function = (_params: any): Promise<any> => {
  //参数处理
  const _queryString = objectToQueryString(_params);
  return fetch({
    url: `${_serviceName}?${_queryString}`,
    method: 'GET'
  });
}
export default {
  getPaged,
  add,
  update,
  remove,
  details
}