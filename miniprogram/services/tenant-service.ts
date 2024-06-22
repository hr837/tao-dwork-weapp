import { fetch, objectToQueryString } from './fetch'

/**
 * 企业服务
 */
const _serviceName = '/app-api/tenant';

/**
 * 获取进入公司申请分页列表
 * @param _params 分页查询参数
 */
const invitePaged: Function = (_params: any): Promise<any> => {
  //参数处理
  const _queryString = objectToQueryString(_params);
  return fetch({
    url: `${_serviceName}/invitePage?${_queryString}`,
    method: 'GET'
  });
}

/**
 * 获取列表
 * @param _params 查询参数
 */
const list: Function = (_params: any): Promise<any> => {
  //参数处理
  const _queryString = objectToQueryString(_params);
  
  return fetch({
    url: `${_serviceName}/list?${_queryString}`,
    method: 'GET'
  });
}

/**
 * 新增
 * @param _params 模型
 */
const add: Function = (_params: any): Promise<any> => {
  return fetch({
    url: `${_serviceName}/add`,
    params: _params,
    method: 'POST'
  });
}

/**
 * 认证
 * @param _params 模型
 */
const certification: Function = ( _params: any): Promise<any> => {
  return fetch({
    url: `${_serviceName}/certification`,
    params: _params,
    method: 'POST'
  });
}

export default {
  invitePaged,
  list,
  add,
  certification
}