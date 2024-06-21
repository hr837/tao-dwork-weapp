import { fetch, objectToQueryString, getAuth } from './fetch'

/**
 * 用户服务
 */
const _serviceName = '/app-api/user';

/**
 * 登录
 */
const login: Function = (): Promise<any> => {
  return getAuth();
}

/**
 * 退出登录
 */
const logout: Function = (): void => {
  wx.removeStorageSync('api_token');
  wx.removeStorageSync('api_refresh_token');
}

/**
 * 实名认证
 * @param _params 模型
 */
const certification: Function = (_params: CerfificationInputModel): Promise<any> => {
  return fetch({
    url: `${_serviceName}/certification`,
    params: _params,
    method: 'POST'
  });
}

/**
 * 设置手机号
 * @param _params 模型 { phone: '手机号', captcha: '验证码'}
 */
const setPhone: Function = (_params: { phone: string, captcha: string }): Promise<any> => {
  return fetch({
    url: `${_serviceName}/setPhone`,
    params: _params,
    method: 'POST'
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

/**
 * 实名认证输入模型
 */
export interface CerfificationInputModel {
  /**
   * 姓名
   */
  name: string
  /**
   * 性别
   */
  sex: string
  /**
   * 个人照片	
   */
  personalPhoto: string
  /**
   * 证件号码
   */
  cardNo: string
  /**
   * 住址
   */
  address: string
  /**
   * 身份证照片-正面人像照
   */
  cardPhotoFront: string
  /**
   * 身份证照片-背面国徽照
   */
  cardPhotoBack: string
  /**
   * 证件地址
   */
  cardAddress?: string
  /**
   * 证件有效期（格式：起始-结束）
   */
  cardValidity?: string
  /**
   * 户籍类型（字典）
   */
  domicileType?: string
}






export default {
  login,
  logout,
  certification,
  setPhone,
  remove,
  details
}