import { fetch, objectToQueryString } from './fetch'

const _serviceName = '/admin-api/sysArea';

/**
 * 获取省数据
 */
const settingParentList: any = (_parentCode?: string) => {

  const _queryString = objectToQueryString({ parentCode: _parentCode });

  return fetch({
    url: `${_serviceName}/getByParentCode?${_queryString}`,
    method: 'GET'
  });
}

/**
 * 获取列表
 */
const settingList: any = (_source: number = 1) => {
  return fetch({
    url: `${_serviceName}/settingList`,
    method: 'GET'
  });
}

export default {
  settingList,
  settingParentList
}