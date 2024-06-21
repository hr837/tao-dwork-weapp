import { fileFetch, objectToQueryString } from './fetch';
import Config from '../config/base';

/**
 * 上传文件服务
 */
const _serviceName = '/api/file';

/**
 * 文件上传
 * @param _params 参数
 */
export const uploadFile: Function = (_params: {
  filePath: string,
  formData: any,
  name?: string,
  query: { projectId: string, directoryName?: string, fileName?: string, containsDate?: boolean, isTemp?: boolean, isCompress?: boolean, ocrType?: number }
}): Promise<any> => {

  let {
    filePath,
    formData,
    name,
    query
  } = _params;



  // 参数处理
  const _queryString = objectToQueryString(query);
  // 参数处理
  return fileFetch({
    url: `${Config.mediaUrl}${_serviceName}?${_queryString}`,
    params: { filePath, formData, name }
  });
}