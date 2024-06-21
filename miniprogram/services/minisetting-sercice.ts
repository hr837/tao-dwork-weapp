import { fetch, objectToQueryString } from './fetch'

/**
 * 物流公司服务
 */
const _serviceName = '/api/minisetting';

/**
 * 获取配置信息
 * @param _params 分页查询参数
 */
const getSetting: any = (_params: any) => {
  return fetch({
    url: `${_serviceName}/getsettings`,
    method: 'GET'
  });
}
/**
 * 获取隐私政策
 * @param _params 分页查询参数
 */
const getPolicy: any = (_params: any) => {
  return fetch({
    url: `${_serviceName}/getpolicy`,
    method: 'GET'
  });
}
/**
 * 获取招商广告配置信息
 * @param _params 分页查询参数
 */
const getAdvSetting: any = (_params: any) => {
  return fetch({
    url: `${_serviceName}/getAdvSetting`,
    method: 'GET'
  });
}
/**
 * 获取保险广告配置信息
 * @param _params 参数
 */
const getInsSetting: any = (_params: any) => {
  return fetch({
    url: `${_serviceName}/getInsSetting`,
    method: 'GET'
  });
}

export default {
  getSetting,
  getPolicy,
  getAdvSetting,
  getInsSetting
}