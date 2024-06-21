import config from '../config/base';

class Request {

  constructor() { }

  private static _instance: Request;

  /**
   * 网络请求
   * @param agr 参数
   */
  fetch(agr: CommonType.IRequestConfig, tokenKey: string) {
    let { method, url, params, contentType, authType } = agr;

    // url处理
    let requestUrl: string = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      requestUrl = `${config.apiUrl}${url}`;
    }
    // token处理
    const token = wx.getStorageSync(tokenKey);

    // console.log(method, url, params)
    // 请求方式
    method = method || 'GET';
    // 响应内容
    contentType = contentType || 'application/json';

    return new Promise((resolve, reject) => {
      let header: any = {
        'Content-Type': contentType,
      };
      if (token) {
        header['Authorization'] = `${authType == 'Basic' ? 'Basic' : 'Bearer'} ${token}`
      }

      wx.request({
        url: requestUrl,
        data: params,
        method,
        header: header,
        success(res) {
          resolve(res.data)
        },
        fail(err) {
          reject(err)
        }
      })
    }).catch((err: any) => {
      console.log(err)
    })
  }

  /**
   * 单例
   */
  public static getInstance() {
    // console.log('out', 'Request getInstance ====')

    if (this._instance == null) {
      // console.log('in')
      this._instance = new Request()
    }

    return this._instance
  }
}

// const commonRequest = Request.getInstance()
// export {commonRequest}

export default Request