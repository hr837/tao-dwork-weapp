import { fetch } from './fetch'
/**
 * 首页校验 bindInfo API service
 */
const _serviceName = '/api/WxUser/bindInfo';

const bindInfoCheck: any = (_params: any) => {
  return fetch({
    url: `${_serviceName}`,
    params: _params,
    method: 'GET'
  });
}

export default {
  bindInfoCheck,
}