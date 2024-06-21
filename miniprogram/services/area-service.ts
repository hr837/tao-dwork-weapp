import { fetch, objectToQueryString } from './fetch'

const _serviceName = '/api/area';

/**
 * 获取省数据
 */
const getByParentCode: any = (_parentCode?: string) => {

  const _queryString = objectToQueryString({ parentCode: _parentCode });

  return fetch({
    url: `${_serviceName}/getByParentCode?${_queryString}`,
    method: 'GET'
  });
}

/**
 * 获取省市区列表
 */
const getAreaList: any = (_source: number = 1) => {
  return fetch({
    url: `${_serviceName}/getAll?source=${_source}`,
    method: 'GET'
  });
}

export default {
  getAreaList,
  getByParentCode
}