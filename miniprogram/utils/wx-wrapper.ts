
export async function getSetting() {
  return new Promise((resolve, reject) => wx.getSetting({
    success: (res) => resolve(res),
    fail: (err) => reject({
      err,
      message: `getSetting failed, error:, ${err}`,
    }),
  }));
}

export async function openSetting() {
  return new Promise((resolve, reject) => wx.openSetting({
    success: (res) => resolve(res),
    fail: (err) => reject({
      err,
      message: `openSetting failed, error:, ${err}`,
    }),
  }));
}

export async function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => resolve(res),
      fail: () => reject(`wx.login failed`),
    });
  });
}

export async function getUserInfo() {
  return getSetting()
    .then((xhr: any) => {
      return new Promise((resolve, reject) => {
        // 判断是否授权
        if (xhr && xhr.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              resolve(res.userInfo);
            },
            fail: (err) => reject({
              err,
              message: `wx.getUserInfo failed`,
            }),
          });
        } else {
          reject('scope.userInfo false');
        }
      })
    });
}

export async function setStorage(key: string, value: any) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key,
      data: value,
      success: resolve,
      fail: () => reject(`wx.setStorage(${key}) failed`),
    });
  });
}

export async function getStorage<T>(key: string, defaultValue: any) {
  return new Promise<T>((_resolve, _reject) => {
    wx.getStorage({
      key,
      success: (res) => _resolve(res.data),
      fail: () => {
        console.warn(`wx.getStorage(${key}) failed, return default value:`, defaultValue);
        _resolve(defaultValue); // reject(`wx.getStorage(${key}) failed`)
      },
    });
  });
}

export async function showModal(title: string, content: string, showCancel: boolean) {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      showCancel,
      success: resolve
    });
  });
}

export async function download(url: string, header?: object) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url,
      header,
      success: (res) => resolve(res),
      fail: () => reject(`donwload file ${url} failed`),
    });
  });
}

export async function request(url: string, header?: object, data?: object, method?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      header,
      data,
      method,
      success: (res) => resolve(res),
      fail: (res) => {
        console.error({ res });
        reject(`request url ${url} failed:`);
      },
    });
  });
}

export async function sleep(t: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, t));
}

export async function saveFile(filePath: string) {
  return new Promise<string>((resolve, reject) => {
    wx.saveFile({
      tempFilePath: filePath,
      success(res) {
        resolve(res.savedFilePath);
      },
      fail(err) {
        reject({
          err,
          message: `save file failed:, ${filePath},  error:, ${err}`,
        });
      },
    });
  });
}

export async function getSavedFileInfo(filePath: string) {
  return new Promise((resolve, reject) => {
    wx.getSavedFileInfo({
      filePath,
      success: resolve,
      fail: (err) => reject({
        err,
        message: `getSavedFileInfo failed, error:, ${err}`,
      }),
    });
  });
}

export async function onLocationChange() {
  return new Promise((resolve, reject) => {
    const _locationChangeCallback = (_res: any) => {
      wx.offLocationChange(_locationChangeCallback);
      resolve(_res);
    };

    wx.startLocationUpdate({
      success: (_res: any) => {
        wx.onLocationChange(_locationChangeCallback);
        // resolve(_res);
      },
      fail: (_err: any) => {
        reject(_err);
      }
    });
  });
}

export async function getLocation() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84',
      success: resolve,
      fail: (err) => reject({
        err,
        message: `getLocation failed, error:, ${err}`,
      }),
    });
  })
}

export async function chooseLocation() {
  return new Promise((resolve, reject) => {
    wx.chooseLocation({
      success: resolve,
      fail: (err) => reject({
        err,
        message: `getLocation failed, error:, ${err}`,
      }),
    });
  })
}

export async function getSystemInfo() {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: resolve,
      fail: (err) => reject({
        err,
        message: `getSystemInfo failed, error:, ${err}`,
      }),
    });
  });
}

export async function setClipboardData(data: string) {
  return new Promise((resolve, reject) => {
    wx.setClipboardData({
      data,
      success: resolve,
      fail: (err) => reject({
        err,
        message: `setClipboardData failed, error:, err ${err}`,
      }),
    });
  });
}

export async function showActionSheet(itemList: string[]) {
  return new Promise((resolve, reject) => {
    wx.showActionSheet({
      itemList,
      success: resolve,
      fail: (err) => reject({
        err,
        message: `showActionSheet failed, error:, ${err}`,
      }),
    });
  });
}

export async function getNetworkType() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: (res) => resolve(res.networkType),
      fail: (err) => reject({
        err,
        message: `getNetworkType failed, error:, ${err}`,
      }),
    });
  });
}

/**
 * 自动检查更新更新
 * @param _this 当前实例
 */
export function autoUpdate() {
  // 获取小程序更新机制的兼容，由于更新的功能基础库要1.9.90以上版本才支持，所以此处要做低版本的兼容处理
  if (wx.canIUse('getUpdateManager')) {
    // wx.getUpdateManager接口，可以获知是否有新版本的小程序、新版本是否下载好以及应用新版本的能力，会返回一个UpdateManager实例
    const updateManager = wx.getUpdateManager()
    if (updateManager) {
      // 检查小程序是否有新版本发布，onCheckForUpdate：当小程序向后台请求完新版本信息，会通知这个版本告知检查结果
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          // 检测到新版本，需要更新，给出提示
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否下载新版本并重启小程序？',
            success: function (res) {
              if (res.confirm) {
                // 用户确定更新小程序，小程序下载和更新静默进行
                downLoadAndUpdate(updateManager)
              } else if (res.cancel) {
                // 若用户点击了取消按钮，二次弹窗，强制更新，如果用户选择取消后不需要进行任何操作，则以下内容可忽略
                wx.showModal({
                  title: '提示',
                  content: '本次版本更新涉及到新增功能，旧版本将无法正常使用',
                  showCancel: false, // 隐藏取消按钮
                  confirmText: '确认更新', // 只保留更新按钮
                  success: function (res) {
                    if (res.confirm) {
                      // 下载新版本，重启应用
                      downLoadAndUpdate(updateManager)
                    }
                  }
                })
              }
            }
          })
        }
      })
    }
  } else {
    // 在最新版本客户端上体验小程序
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试'
    })
  }
}

/**
 * 下载小程序最新版本并重启
 * @param {*} updateManager 
 */
function downLoadAndUpdate(updateManager: any) {
  wx.showLoading({ title: '正在更新版本' });

  // 静默下载更新小程序新版本，onUpdateReady：当新版本下载完成回调
  updateManager.onUpdateReady(function () {
    wx.hideLoading()
    // applyUpdate：强制当前小程序应用上新版本并重启
    updateManager.applyUpdate()
  })
  // onUpdateFailed：当新版本下载失败回调
  updateManager.onUpdateFailed(function () {
    // 下载新版本失败
    wx.showModal({
      title: '已有新版本',
      content: '新版本已经上线了，请删除当前小程序，重新搜索打开'
    })
  })
}