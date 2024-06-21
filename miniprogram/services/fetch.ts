import config from '../config/base';

/**
 * 网络参数配置
 */
interface parmasConfig {
  url: string,
  data?: any,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | any
}

/**
 * 文件上传参数配置
 */
interface fileParmasConfig {
  url: string,
  filePath: string,
  formData: any,
  name: string
}

/**
 * 是否有请求正在刷新token
 */
let isRefreshing: boolean = false;

/**
 * 被挂起的请求的数组
 */
const refreshSubscribers: Array<any> = [];

/**
 * 将请求push到数组中
 * @param cb 参数
 */
const subscribersTokenRefresh: Function = (cb: Function): void => {
  refreshSubscribers.push(cb)
}

/**
 * 刷新token后，将数组中的请求重新发起
 * @param token TOKEN
 */
const onRefershed: Function = (token: string) => {
  refreshSubscribers.map((cb: Function) => cb(token))
}

function filterParams(params: any) {
  for (let key in params) {
    if (params.hasOwnProperty(key)
      && (params[key] == null
        || params[key] == undefined
        || params[key] === ''
        || params[key] === 'null'
        || params[key] === 'undefined'
      )) {
      delete params[key];
    }
  }

  return params;
}

/**
 * 业务API授权
 */
export const getAuth: Function = () => {
  return new Promise((resolve, reject) => {
    // 微信登录
    wx.login({
      success: (res) => resolve(res),
      fail: () => reject(`wx.login failed`),
    });
  }).then((_res: any) => {
    return new Promise<CommonType.IAuthViewModel>((resolve, reject) => {
      let header: any = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${config.auth_code}`
      };

      wx.request({
        url: `${config.apiUrl}/oauth2/token`,
        data: {
          appid: config.appid,
          grant_type: config.grant_type,
          scope: config.scope,
          // jscode
          code: _res.code,
        },
        method: 'POST',
        header: header,
        success(res: any) {
          const data: any = res.data;
          if (data) {
            wx.setStorageSync('api_token', data.access_token);
            wx.setStorageSync('api_refresh_token', data.refresh_token);
          }

          resolve(res.data)
        },
        fail(err) {
          reject(err)
        }
      })
    }).catch((err: any) => {
      console.log(err)
    })
  });
}

/**
 * 网络请求
 * @param agr 参数
 */
export const fetch: Function = (agr: CommonType.IRequestConfig): Promise<any> => {
  let { method, url, params, contentType, authType } = agr;

  // url处理
  let requestUrl: string = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    requestUrl = `${config.apiUrl}${url}`;
  }
  //请求参数清理各种空数据
  params = filterParams(params);

  // token处理
  const token = wx.getStorageSync('api_token')
  // 请求方法
  method = method || 'GET'
  // 响应内容
  contentType = contentType || 'application/json'

  let httpDefault: parmasConfig = {
    url: requestUrl,
    data: params,
    method,
  }

  return new Promise((resole, reject) => {
    let header: any = {
      'Content-Type': contentType,
    };
    if (token) {
      header['Authorization'] = `${authType == 'Basic' ? 'Basic' : 'Bearer'} ${token}`
    }

    wx.request({
      ...httpDefault,
      header: header,
      success(res: any) {
        if (res && (res.statusCode == 401 || res.statusCode == 403)) {
          resole(refreshToken(contentType, authType, httpDefault))
        } else {
          resole(res.data)
        }
      },
      fail(err: any) {
        if (err.response && (err.response.status == '401' || err.response.status == '403')) {
          // window.location.href = '/login'
          // console.log('tokenfail')
          resole(refreshToken(contentType, httpDefault))
        } else {
          // console.log('else')
          reject(err)
        }
      }
    })
  }).catch((_err: any) => {
    // console.log('err')
    // console.log(err.response)
  })
}

/**
 * token 过期操作
 * @param contentType Content-Type
 * @param authType 授权类型
 * @param httpDefault 请求参数
 */
const refreshToken: Function = (contentType: string, authType: 'Basic' | 'Bearer', httpDefault: parmasConfig): Promise<any> => {

  //请求挂起
  let retry = new Promise((resole, reject) => {
    const refershFnc = (newToken: string) => {
      resole(new Promise((resole, reject) => {
        let header: any = {
          'Content-Type': contentType,
        };
        if (newToken) {
          header['Authorization'] = `${authType == 'Basic' ? 'Basic' : 'Bearer'} ${newToken}`
        }

        wx.request({
          ...httpDefault,
          header: header,
          success(res) {
            // console.log('success')
            if (res && (res.statusCode == 401 || res.statusCode == 403)) {
              resole(retry)
            } else {
              resole(res.data)
            }
          },
          fail(err: any) {
            // console.log('fail')
            // console.log(err.response)

            if (err.response && (err.response.status == '401' || err.response.status == '403')) {
              // window.location.href = '/login'
              // console.log('tokenfail')
              resole(retry)
            } else {
              // console.log('else')
              reject(err)
            }
          }
        })
      })
        .catch((err: any) => {
          // console.log('catch')
          // console.log(err.response)
          reject(err)
        })
      )
    }

    subscribersTokenRefresh(refershFnc);
  })

  if (!isRefreshing) {
    isRefreshing = true;

    return new Promise((resolve, reject) => {
      getAuth()
        .then((res: any) => {
          console.log(res, 'res')

          if (res && res.access_token) {
            onRefershed(res.access_token);

            isRefreshing = false;
            resolve(retry)
          } else {
            isRefreshing = false;
            reject('auth error');
          }
        })
        .catch((err: any) => {
          console.log(err, 'fetch error 报错')
          isRefreshing = false;
          reject(err);
        })
    })
  } else {
    isRefreshing = false;

    return Promise.resolve(retry)
  }
}

/**
 * 文件上传网络请求
 * @param agr 参数
 */
export const fileFetch: Function = (agr: CommonType.IRequestConfig): Promise<any> => {

  let { url, params, contentType, authType } = agr;

  // url处理
  let requestUrl: string = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    requestUrl = `${config.mediaUrl}${url}`;
  }
  // token处理
  const token = wx.getStorageSync('token')
  // 响应内容
  contentType = contentType || 'multipart/form-data'

  let httpDefault: fileParmasConfig = {
    url: requestUrl,
    filePath: params.filePath,
    formData: params.formData,
    name: params.name || 'file',
  }

  // 判断token是否存在
  if (token) {
    return new Promise((resole, reject) => {
      let header: any = {
        'Content-Type': contentType,
      };
      if (token) {
        header['Authorization'] = `${authType == 'Basic' ? 'Basic' : 'Bearer'} ${token}`
      }

      wx.uploadFile({
        ...httpDefault,
        header: header,
        success(res: any) {
          if (res && (res.statusCode == 401 || res.statusCode == 403)) {
            resole(refreshToken(contentType, authType, httpDefault))
          } else {
            resole(res.data)
          }
        },
        fail(err: any) {
          if (err.response && (err.response.status == '401' || err.response.status == '403')) {
            // window.location.href = '/login'
            // console.log('tokenfail')
            resole(refreshToken(contentType, httpDefault))
          } else {
            // console.log('else')
            reject(err)
          }
        }
      })
    }).catch((_err: any) => {
      // console.log('err')
      // console.log(err.response)
    })
  } else {
    // token过期，
    return fileRefreshToken(contentType, httpDefault)
  }
}

/**
 * 文件上传 token 过期操作
 * @param contentType Content-Type
 * @param authType 授权类型
 * @param httpDefault 请求参数
 */
const fileRefreshToken: Function = (contentType: string, authType: 'Basic' | 'Bearer', httpDefault: fileParmasConfig): Promise<any> => {
  //请求挂起
  let retry = new Promise((resole, reject) => {
    const refershFnc = (newToken: string) => {
      resole(new Promise((resole, reject) => {
        let header: any = {
          'Content-Type': contentType,
        };
        if (newToken) {
          header['Authorization'] = `${authType == 'Basic' ? 'Basic' : 'Bearer'} ${newToken}`
        }

        wx.uploadFile({
          ...httpDefault,
          header: header,
          success(res: any) {
            // console.log('success')
            if (res && (res.statusCode == 401 || res.statusCode == 403)) {
              resole(retry)
            } else {
              resole(res.data)
            }
          },
          fail(err: any) {
            // console.log('fail')
            // console.log(err.response)

            if (err.response && (err.response.status == '401' || err.response.status == '403')) {
              // window.location.href = '/login'
              // console.log('tokenfail')
              resole(retry)
            } else {
              // console.log('else')
              reject(err)
            }
          }
        })
      }).catch((err: any) => {
        // console.log('catch')
        // console.log(err.response)
        reject(err)
      })
      )
    }

    subscribersTokenRefresh(refershFnc);
  })

  if (!isRefreshing) {
    isRefreshing = true;

    return new Promise((resolve, reject) => {
      getAuth()
        .then((res: any) => {
          console.log(res, 'res')

          if (res && res.access_token) {
            onRefershed(res.access_token);

            isRefreshing = false;
            resolve(retry)
          } else {
            isRefreshing = false;
            reject('auth error');
          }
        })
        .catch((err: any) => {
          console.log(err, 'fetch error 报错')
          isRefreshing = false;

          reject(err);
        })
    })
  } else {
    isRefreshing = false;

    return Promise.resolve(retry)
  }
}

/**
 * 参数转为查询参数
 * @param _params 参数
 */
export const objectToQueryString: Function = function (_params: Object) {
  // 判断参数是否为对象且不为数组
  if (typeof _params == 'object' && !Array.isArray(_params)) {
    const _paramsArray = [];
    // 参数解析
    for (const [_key, _value] of Object.entries(_params)) {
      // 判断是否为数字
      if (typeof _value == 'number' && _value) {
        _paramsArray.push(`${_key}=${_value}`);
        continue;
      }
      // 判断是否为字符串
      if (typeof _value == 'string' && _value) {
        _paramsArray.push(`${_key}=${_value}`);
        continue;
      }
      // 判断是否为枚举
      if (typeof _value == 'boolean') {
        _paramsArray.push(`${_key}=${_value}`);
        continue;
      }
      // 判断是否为数组
      if (Array.isArray(_value) && _value) {
        _value.forEach((_item: any) => {
          // if (Array.isArray(_item) || typeof _item == 'object') {
          //   return;
          // }
          // 循环处理
          _paramsArray.push(`${_key}=${_item}`);
        })
        continue;
      }
      // 判断是否为Date
      if (_value instanceof Date) {
        _paramsArray.push(`${_key}=${_value}`);
        continue;
      }
    }

    return `${_paramsArray.join('&')}`;
  } else {
    return _params;
  }
}
