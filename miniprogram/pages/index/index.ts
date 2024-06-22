const app = getApp<IAppOption>()
// var WXAPI = require('../../services/wechat-service');
import WXAPI from '../../services/wechat-service'
import DIC_STORAGE_API from '../../storages/dic-storage'
import config from "../../config/base"

Page({
  data: {
    /**
     * 用户状态
     * 0：未知；1：未授权；2：未认证；3：已认证
     */
    userStatus: 0,
    /**
     * 微信头像
     */
    avatarUrl: '',
    /**
     * 微信昵称
     */
    nickName: '点此授权',
    /**
     * 用户电话
     */
    userPhone: '',
    /**
     * 联系人电话
     */
    contactPhone: ''
  },

  onLoad(_options: any) {
    // wx.showLoading({ title: '加载中...', mask: true })
    // this.init(_options);
    const setting = app.globalData.setting;
    if (setting) {
      this.setData({ contactPhone: setting.contactPhone })
    }
    let userPhone = setting?.contactPhone
    console.log(app.globalData);

  },

  /**
  * 获取用户手机号
  */
  getPhoneNumber(e: any) {
    console.log(e);

    var that = this;
    if (!app.globalData) {
      // 检查用户是否已获取到授权信息
      WXAPI.getPhoneNum(e.detail.code).then((response: any) => {
        if (!response.didError) {
          wx.setStorageSync('phoneNumber', response.phone_info.phoneNumber)
          that.setData({
            phoneNumber: response.phone_info.phoneNumber
          })
        }
      });
    } else {
      WXAPI.getPhoneNum(e.detail.code).then((response: any) => {
        if (!response.didError) {
          wx.setStorageSync('phoneNumber', response.phone_info.phoneNumber)
          that.setData({
            phoneNumber: response.phone_info.phoneNumber
          })
        }
      });
    }
  },

  onShow() {
    const _this = this;

    // 回调函数
    let _authCallback = (_authInfo?: CommonType.IAuthViewModel | null) => {
      if (_authInfo) {
        _this.setData({ userStatus: +_authInfo.status })


        this.init();
      }
    }

    if (app.globalData.authInfo) {
      _authCallback(app.globalData.authInfo);
    } else {
      if (app.globalData.authSuccess) {
        app.authCallback = _authCallback;
      } else {
        _authCallback(app.globalData.authInfo);
      }
    }
  },

  /**
   * 初始化
   * @param _options 扩展参数
   */
  init(_options?: any) {
    // debugger;
    DIC_STORAGE_API.getDicByCategoryCode('xb').then((_data: any) => {
      console.log(_data, '性别缓存');
    })
  },
  /**
   * 用户信息更新事件
   * @param _event 参数
   */
  onUserChange(_event: any) {
    let _authInfo = app.globalData.authInfo;
    //有传值就用传值的数据更新
    if (_event) {
      _authInfo = _event.detail;
    }
    if (_authInfo) {

      let defaultNickname = '';
      switch (+_authInfo.status) {
        case 1:
          defaultNickname = '点此授权';
          break;
        case 2:
          defaultNickname = '点此认证';
          break;
        case 3:
          defaultNickname = '已认证';
          break;
        default:
          defaultNickname = '点此授权';
          break;
      }

      this.setData({
        // 用户昵称
        nickName: _authInfo.nickName ? _authInfo.nickName : defaultNickname,
        // 用户头像
        avatarUrl: _authInfo.avatarUrl ? ((config.mediaUrl + "/" + _authInfo.avatarUrl)) : '',
        // 用户电话
        userPhone: _authInfo.phone ? _authInfo.phone : '',
        // 用户状态
        userStatus: +_authInfo.status,
      })
    }
    wx.hideLoading()
  },
  /**
   * 微信用户授权点击事件
   * @param _event 句柄
   */
  onGetUserProfile(_event: any) {
    const _this = this;

    const code = _event.detail.code;
    // 0:未知；1：未授权；2：未认证；3：已认证
    const userStatus = +_event.detail.userStatus;
    switch (userStatus) {
      case 0:
      case 1:
      // 更新用户状态
      case 2:
        // 更新用户状态
        break;
      case 3:
        // 跳转到实名认证详情页面，预览实名信息
        wx.navigateTo({ url: `/pages/my/information/information` })
        break;
      default:
        // 用户状态为0时，不处理业务
        break;
    }
    if (_this.data.avatarUrl) {
      wx.navigateTo({ url: `/pages/public/user-info/user-info?avatarUrl=${this.data.avatarUrl}&nickName=${this.data.nickName}` })
    } else {
      // 跳转到补充头像、昵称页面
      wx.navigateTo({ url: '/pages/public/user-info/user-info' })
    }
  },
  /**
   * 绑定图片错误事件
   * @param _event 句柄
   */
  bindErrorImg(_event: any) {
    this.setData({ avatarUrl: '/assets/images/car-headimg.png', })
  },

  /**
   * 跳转到项目列表
   * @param _e 参数
   */
  onProject(_e: any) {
    wx.navigateTo({ url: '/pages/project/project-list/project-list' })
  },
  /**
   * 扫描二维码
   * @param _e 参数
   */
  onScanQrcode(_e: any) {
    const _this = this;

    wx.scanCode({
      onlyFromCamera: false,
      success: (_res: any) => {
        const result = _res.result;

        console.log(result, '扫描二维码');
      },
      fail: (_err: any) => {
        
        console.log(_err, '扫描二维码失败');
      }
    })
  },

  /**
   * 跳转到实名认证
   * @param _e 参数
   */
  onCertification(_e: any) {
    wx.navigateTo({ url: '/pages/mine/certification/certification' })
  },

  // 创建企业
  onCreateCompany() {
    wx.navigateTo({ url: '/pages/company/create/create' })
  }
}) 