// // app.ts
// App<IAppOption>({
//   globalData: {},
//   onLaunch() {
//     // 展示本地存储能力
//     const logs = wx.getStorageSync('logs') || []
//     logs.unshift(Date.now())
//     wx.setStorageSync('logs', logs)

//     // 登录
//     wx.login({
//       success: res => {
//         console.log(res.code)
//         // 发送 res.code 到后台换取 openId, sessionKey, unionId
//       },
//     })
//   },
// })
import { autoUpdate } from './utils/wx-wrapper'
import userService from './services/user-service';

App<IAppOption>({
  /**
   * 全局变量
   */
  globalData: {
    authInfo: null,
    authSuccess: true,
    getLocationSuccess: true,
  },
  /**
   * 应用程序加载
   * @param _options 参数
   */
  onLaunch(_options: WechatMiniprogram.App.LaunchShowOption) {
    const _this = this;

    // 清空缓存
    wx.clearStorage();
    // 小程序版本检测并更新版本
    autoUpdate();

    if (_options.query && _options.query.scene) {
      // 扫码业务
      if (_options.query.scene) {
        // url解码
        // let scene = decodeURIComponent(_options.query.scene);
        // &是我们定义的参数链接方式
        // const _recommendNum = scene.split("&")[0];
      }
    }

    // 微信登录
    userService.login().then((_res: CommonType.IAuthViewModel) => {

      // 授权信息
      _this.globalData.authInfo = _res;

      if (_res) {
        // 授权成功
        _this.globalData.authSuccess = true;

        if (_this.authCallback) {
          _this.authCallback(_res);
        }
      } else {
        // 授权成功
        _this.globalData.authSuccess = false;

        if (_this.authCallback) {
          _this.authCallback(null as any);
        }
      }
      console.log(_res, '微信登录======');
    }, (_reject: any) => {
      // 授权成功
      _this.globalData.authSuccess = false;

      if (_this.authCallback) {
        _this.authCallback(null as any);
      }
    }).catch((_err: any) => {
      // 授权成功
      _this.globalData.authSuccess = false;

      if (_this.authCallback) {
        _this.authCallback(null as any);
      }

      console.log(_err, '微信登录失败======');
    });

    // // 获取小程序配置
    // miniSettingService.getSetting().then((_res: any) => {
    //   if (_res.code == 0) {
    //     _this.globalData.setting = { contactPhone: _res.data.contactPhone };
    //   }
    // })
  }
})