import smsService from "../../../services/sms-service";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 电话号码
     */
    phone: {
      type: String,
    },
    /**
     * 表单值
     */
    value: {
      type: String,
      value: ''
    },
    /**
     * 倒计时时间
     */
    smsNum: {
      type: Number,
      value: 120
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /**
     * 是否正在倒计时
     */
    smsTiming: false,
    /**
     * 按钮文字
     */
    smsBtnText: '短信验证码',
    /**
     * 定时器
     */
    timer: 0,
    /**
     * 置灰
     */
    disabled: false
  },
  /**
   * 生命周期
   */
  lifetimes: {
    detached() {
      this.smsCodeStop();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * input值变更监听
     * @param _event 参数
     */
    onInputValueChange(_event: any) {
      // 属性名
      const _name = _event.currentTarget.dataset.name;
      // 更新数据
      this.setData({ [`${_name}`]: _event.detail.value })
      // 值变更
      this.triggerEvent('change', { value: _event.detail.value })
    },
    /**
     * 生成短信验证码变更事件
     * @param _event 参数
     */
    onSmsCode(_event: any) {
      const phone = this.data.phone;
      if (!phone) {
        wx.showToast({ title: '请输入电话号码', icon: 'none' })
        return;
      }

      if (!/^1\d{10}$/.test(phone)) {
        wx.showToast({ title: "手机号码格式有误", duration: 2000, icon: "none" });
        return;
      }

      // 判断是否正在倒计时，如果正在倒计时，则不允许用户再次请求获取验证码
      if (!this.data.smsTiming) {
        // 倒计时
        this.smsCodeTimer();
      }
      // 短信服务
      smsService.registrationSms(phone).then((_res: any) => {
        if (_res.code == 0) {
          wx.showToast({ title: '验证码已发送', icon: 'none' });
        } else {
          wx.showToast({ title: '验证码发送失败', icon: 'none' });
        }
      });
    },

    /**
     * 倒计时结束
     */
    smsCodeStop() {
      // 初始化倒计时数字
      this.setData({ smsTiming: false, disabled: false });

      if (this.data.timer) {
        clearInterval(this.data.timer as any);
      }
    },

    /**
     * 短信验证码倒计时
     */
    smsCodeTimer() {
      const _this = this;

      try {
        // 初始化倒计时数字
        _this.setData({ smsNum: 120, smsTiming: true, disabled: true });

        const _timer = setInterval(function () {
          _this.setData({ smsNum: _this.data.smsNum - 1 });

          if (_this.data.smsNum <= 0) {
            _this.smsCodeStop();
          }
        }, 1000)

        _this.setData({ timer: _timer as any });
      } catch {
        this.smsCodeStop();
      }
    },
  }
})
