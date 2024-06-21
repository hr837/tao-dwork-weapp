// components/auth-button/auth-button.ts


// 获取应用实例 
const app = getApp<IAppOption>()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 授权级别
     * 0：未知；1：不需要授权；2：需要微信授权；3：实名认证
     */
    status: {
      type: Number,
      value: 3,
      observer: function (_newVal: any, _oldVal: any, _changePath: any) {

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /**
     * 用户权鉴状态
     */
    userStatus: 0,
    /**
     * 用户ID
     */
    customerId: '',
  },

  lifetimes: {
    attached() {

    },
    /**
     * 页面渲染完成
     */
    ready() {
      this.init();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 初始化
   * @param _customerInfo 参数
   * @param _options 扩展参数
   */
    init(_options?: any) {
      const _this = this;

      // 回调函数
      const _customerCallback = (_customerInfo?: CommonType.ICustomerInfo) => {
        if (_customerInfo) {
          // TODO: 业务处理
          // 用户信息
          _this.setData({ userStatus: +_customerInfo.status, })
          // 用户数据加载完成
          _this.triggerEvent('load', { ..._customerInfo });
        }
      }

      if (app.globalData.customerInfo) {
        _customerCallback(app.globalData.customerInfo);
      } else {
        if (app.globalData.loadCustomerSuccess) {
          app.authCallback = _customerCallback;
        } else {
          _customerCallback(app.globalData.customerInfo);
        }
      }
    },

    /**
     * 用户权鉴事件
     * @param _event 参数
     */
    onGetUserProfile(_event: any) {


      const _this = this;

      // 回调函数
      const _customerCallback = (_customerInfo?: CommonType.ICustomerInfo) => {
        if (_customerInfo) {
          // 更新用户状态
          _this.setData({ userStatus: +_customerInfo.status, customerId: _customerInfo.customerId });
          // 业务处理
          _this.deal(_this.data.userStatus);
        } else {
          wx.showToast({ title: '用户获取失败，请联系客服', icon: 'none' });
        }
      }

      if (app.globalData.customerInfo) {
        _customerCallback(app.globalData.customerInfo);
      } else {
        if (app.globalData.loadCustomerSuccess) {
          app.authCallback = _customerCallback;
        } else {
          _customerCallback(app.globalData.customerInfo);
        }
      }
    },
    /**
     * 
     * @param userStatus 用户状态 0:未知；1：未授权；2：未认证；3：已认证
     */
    deal(userStatus: number) {
      const _this = this;

      // 0:未知；1：未授权；2：未认证；3：已认证
      switch (userStatus) {
        case 0:
        case 1:
          // 判断权鉴等级
          if (_this.properties.status === 0 || _this.properties.status === 1) {
            _this.triggerEvent('authed', { code: 0, busCode: 0, userStatus: _this.data.userStatus, customerId: _this.data.customerId });
            return;
          }

          // 微信授权获取用户信息
          wx.getUserProfile({
            desc: '用于完善用户资料',
            success: (_res: any) => {
              const profile = _res.userInfo;
              if (profile) {

              } else {
                // 权鉴失败事件触发
                _this.triggerEvent('authed', { code: 1, busCode: 0, userStatus: _this.data.userStatus });
              }
            },
            fail() {
              // 权鉴失败事件触发
              _this.triggerEvent('authed', { code: 1, userStatus: _this.data.userStatus });
            }
          })
          break;
        case 2:
          // 判断权鉴登记
          if (_this.properties.status === 2) {
            // 权鉴等级为微信授权等级
            _this.triggerEvent('authed', { code: 0, busCode: 0, userStatus: _this.data.userStatus, customerId: _this.data.customerId });
            return;
          }

          // 跳转到实名认证页面实名认证
          wx.navigateTo({ url: `/pages/my/real-name/real-name` });
          break;
        case 3:
          // 执行业务操作
          _this.triggerEvent('authed', { code: 0, userStatus: _this.data.userStatus, customerId: _this.data.customerId });
          break;
      }
    }
  }
})
