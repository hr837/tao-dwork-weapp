import { fetch } from './fetch'
import config from '../config/base';

/**
 * 微信服务
 */
const _serviceName = `${config.baseUrl}/api/wechat/miniprogram`;

/**
 * 获取微信小程序token
 */
const getToken: any = () => {
  const miniprogramId = config.miniprogramId;
  // 参数处理
  return fetch({
    url: `${_serviceName}/token/${miniprogramId}`,
    method: 'GET'
  });
}

/**
 * code2session
 * @param jsCode 授权码
 */
const code2session: any = (jsCode: string) => {
  // const miniprogramId = config.miniprogramId;
  const applicationId = config.applicationId
  // 参数处理
  return fetch({
    url: `${_serviceName}/jscode2session/${applicationId}?jsCode=${jsCode}`,
    method: 'GET'
  });
}

/**
 * 微信授权获取用户手机号码
 */
const getPhoneNum: any = (e: any) => {
  // const miniprogramId = config.miniprogramId;
  const applicationId = config.applicationId

  // 参数处理
  return fetch({
    url: `${_serviceName}/userphone/${applicationId}?code=${e}`,
    method: 'GET'
  });
}

export default {
  getToken,
  code2session,
  getPhoneNum
}