import { fileFetch, objectToQueryString } from './fetch';
import Config from '../config/base';

/**
 * 上传文件服务
 */
const _serviceName = '/admin-api/file';

/**
 * 文件上传
 * @param _params 参数
 */
export const uploadFile: Function = (_params: {
  filePath: string,
  formData: any,
  name?: string
}): Promise<any> => {

  let {
    filePath,
    formData,
    name
  } = _params;

  // 参数处理
  return fileFetch({
    url: `${Config.apiUrl}${_serviceName}/upload`,
    params: { filePath, formData, name }
  });
}