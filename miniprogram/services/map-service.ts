import { idFetch } from './fetch'
import config from '../config/base';

/**
 * 地图服务
 */
const _serviceName = `${config.baseUrl}/api/map`;

/**
 * 根据地址获取经纬度
 * @param _address 地址
 */
const getLocationByAddress: Function = (_address: string): Promise<any> => {
  // 参数处理
  return idFetch({
    url: `${_serviceName}/location?address=${_address}`,
    method: 'GET'
  });
}

/**
 * 根据经纬度获取地址
 * @param level 0: 直辖市/省会；1：市；2：县区
 */
const getAddressByLocation: Function = (_location: string): Promise<any> => {
  // 参数处理
  return idFetch({
    url: `${_serviceName}/address?location=${_location}`,
    method: 'GET'
  });
}

/**
 * 根据城市级别获取行政区列表
 * @param level 0: 全部；1：直辖市/省会；1：市；2：县区
 */
const getByLevel: Function = (level: number = 0): Promise<any> => {
  // 参数处理
  return idFetch({
    url: `${_serviceName}/list?level=${level}`,
    method: 'GET'
  });
}

/**
 * 获取下级行政区列表
 * @param _id 行政区ID
 */
const getChildren: Function = (_id: string): Promise<any> => {
  return idFetch({
    url: `${_serviceName}/getchildren?id=${_id}`,
    method: 'GET'
  });
}

/**
 * 行政区搜索
 * @param id ID
 * @param _params 模型
 */
const search: Function = (_keyword: string): Promise<any> => {
  return idFetch({
    url: `${_serviceName}/search?keyword=${_keyword}`,
    method: 'GET'
  });
}

export default {
  getLocationByAddress,
  getAddressByLocation,
  getByLevel,
  getChildren,
  search
}