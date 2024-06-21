import { fetch, objectToQueryString } from './fetch'
import config from '../config/base';

/**
 * 短信服务
 */
const _serviceName = `${config.baseUrl}/sms`;

/**
 * 获取短信验证码
 * @param phone 手机号
 * @param businessType 业务类型
 */
const getSmsCaptcha: Function = (phone: string, businessType: number): Promise<any> => {

  const _queryString = objectToQueryString({ phone: phone, businessType: businessType });

  return fetch({
    url: `${_serviceName}/get?${_queryString}`,
    method: 'GET'
  });
}

/**
 * 验证短信
 * @param phone 手机号码
 * @param captcha 验证码
 * @param businessType 业务类型
 */
const checkSmsCaptcha: any = (phone: string, captcha: string, businessType: number) => {

  const _queryString = objectToQueryString({ phone, captcha, businessType });

  return fetch({
    url: `${_serviceName}/check?${_queryString}`,
    method: 'GET'
  });
}

export default {
  getSmsCaptcha,
  checkSmsCaptcha
}