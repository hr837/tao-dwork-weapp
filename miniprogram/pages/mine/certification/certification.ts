// pages/mine/certification/certification.ts
import { timestampToDate, validIDNum } from '../../../utils/util';
import DIC_STORAGE_API from '../../../storages/dic-storage';
import smsService from "../../../services/sms-service";
import userService from "../../../services/user-service";

// 获取应用实例 
const app = getApp<IAppOption>()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * ID
     */
    id: null,
    /**
     * 辖区集
     */
    areaOptions: [] as Array<any>,
    /**
     * 机构集
     */
    orgOptions: [] as Array<any>,
    /**
     * 用户姓名
     */
    name: '',
    /**
     * 性别 1：男；2：女
     */
    gender: 1,
    /**
     * 证件类型
     */
    certType: [],
    /**
     * 证件号码
     */
    certNo: '',
    /**
     * 证件照正面
     */
    certFront: '',
    /**
     * 证件照背面
     */
    certBack: '',
    /**
     * 出生日期
     */
    birth: null,
    /**
     * 手机号码
     */
    phone: '',
    /**
     * 辖区编码
     */
    areaId: '',
    areaIdSelected: [] as Array<any>,
    /**
     * 机构编码
     */
    orgCode: '',
    orgCodeSelected: [] as Array<any>,
    /**
     * 地址
     */
    address: '',
    /**
     * 从业证书
     */
    certImg: '',
    /**
     * 医师资格证号
     */
    certNum: '',
    /**
     * 证书签发日期
     */
    issued: timestampToDate(Date.now()),
    /**
     * 执业范围
     */
    scope: '',
    /**
     * 短信验证码
     */
    smsCode: '',
    /**
     * 备注
     */
    remark: '',
    /**
     * 行版本
     */
    rowVersion: undefined,
    /**
     * 用户服务协议及隐私声明
     */
    agreeChecked: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 初始化
   * @param _options 参数
   */
  init(_options?: any) {
    const _this = this;
    
    wx.showLoading({ title: '加载中...' })

    // 回调函数
    let _authCallback = (_authInfo?: CommonType.IAuthViewModel | null) => {

      if (_authInfo) {
        // TODO: 业务处理

      } else {

      }

      wx.hideLoading();
    };

    if (app.globalData.authInfo) {
      _authCallback(app.globalData.authInfo);
    } else {
      if (app.globalData.authSuccess) {
        _authCallback(app.globalData.authInfo);
      } else {
        app.authCallback = _authCallback;
      }
    }

    // 民族类别
    DIC_STORAGE_API.getDicByCategoryCode('national_type').then((_res: any) => {
      this.setData({ mzdmOptions: _res });
    })

    // 性别
    DIC_STORAGE_API.getDicByCategoryCode('sex_type').then((_res: any) => {
      this.setData({ xbdmOptions: _res });
    })
  },
  /**
   * input值变更监听
   * @param _event 参数
   */
  onInputValueChange(_event: any) {
    console.log('onInputValueChange ================');
    // 属性名
    const _name = _event.currentTarget.dataset.name;
    // 更新数据
    this.setData({ [`${_name}`]: _event.detail.value })
  },
  /**
   * 上传文件更新事件
   * @param _event 参数
   */
  onImageChange(_event: any) {
    console.log('onImageChange ================');

    // 属性名
    const _name = _event.currentTarget.dataset.name;
    const detail = _event.detail;
    const id = detail.id;
    const value = detail.value;

    // 更新数据
    this.setData({ [`${_name}`]: detail.value })
  },

  /**
   * 显示Picker点击事件
   * @param _e 参数
   */
  onShowPicker(_e: any) {
    const { name } = _e.currentTarget.dataset;
    this.setData({ [`${name}Visible`]: true });
  },

  /**
   * Picker确认点击事件
   * @param _e 参数
   */
  onPickerChange(_e: any) {
    const { name } = _e.currentTarget.dataset;
    const { selectedOptions, value } = _e.detail;

    this.setData({ [`${name}`]: value });
    if (selectedOptions) {
      // 对象深拷贝赋值
      // this.setData({ [`${name}Selected`]: Object.assign({}, selectedOptions) });
      this.setData({ [`${name}Selected`]: selectedOptions });
    }

    // 隐藏弹窗
    this.setData({ [`${name}Visible`]: false });
  },

  /**
   * Pick 列改变事件
   * @param _e 
   */
  onPickeColumnChange(_e: any) {

  },

  /**
   * Pick 取消点击事件
   * @param _e 
   */
  onHidePicker(_e: any) {
    const { name } = _e.currentTarget.dataset;
    this.setData({ [`${name}Visible`]: false });
  },

  onRadioGroupChange(_event: any) {
    this.setData({
      [_event.currentTarget.dataset.name]: _event.detail.value
    });
  },

  /**
   * 手机号变更事件
   * @param _e 参数
   */
  onPhoneChange(_e: any) {
    // 更新数据
    this.setData({ phone: _e.detail.value });
  },

  /**
   * 短信验证码变更事件
   * @param _e 参数
   */
  onSmsCodeChange(_e: any) {
    // 更新数据
    this.setData({ smsCode: _e.detail.value });
  },

  /**
   * 跳转至身份证
   */
  onIdAttestation() {
    wx.navigateTo({ url: '/pages/public/id-attestation/id-attestation' })
  },

  /**
   * 跳转至人脸识别
   */
  onFaceAttestation() {
    wx.navigateTo({ url: '/pages/practitioner/face-attestation/face-attestation' })
  },

  /**
   * 提交
   */
  onSubmit() {
    // 表单验证
    if (!this.data.name) {
      wx.showToast({ title: '请填写姓名', icon: 'none' })
      return;
    }
    if (this.data.gender != 1 && this.data.gender != 2) {
      wx.showToast({ title: '请选择性别', icon: 'none' })
      return;
    }
    if (!this.data.certNo) {
      wx.showToast({ title: '请填写身份证号', icon: 'none' })
      return;
    }
    if (!validIDNum(this.data.certNo)) {
      wx.showToast({ title: '请输入正确的身份证号', icon: 'none' })
      return;
    }
    if (!this.data.areaId) {
      wx.showToast({ title: '请选择分管派出所', icon: 'none' })
      return;
    }
    if (!this.data.certNum) {
      wx.showToast({ title: '请输入医师资格证号', icon: 'none' })
      return;
    }
    if (!this.data.certFront) {
      wx.showToast({ title: '请上传身份证正面照', icon: 'none' })
      return;
    }
    if (!this.data.certBack) {
      wx.showToast({ title: '请上传身份证背面照', icon: 'none' })
      return;
    }
    if (!this.data.certImg) {
      wx.showToast({ title: '请添加从业证书', icon: 'none' })
      return;
    }
    if (!this.data.phone) {
      wx.showToast({ title: '请填写手机号码', icon: 'none' })
      return;
    }
    if (!this.data.smsCode) {
      wx.showToast({ title: '请填写短信验证码', icon: 'none' })
      return;
    }

    if (!this.data.agreeChecked) {
      wx.showToast({ title: '请同意用户服务协议及隐私声明', icon: 'none' })
      return;
    }

    // 短信验证码校验
    smsService.checkSmsCaptcha(this.data.phone, '123123', 1).then((_res: any) => {
      if (_res && _res.code == 200) {

        console.log(_res, '获取短信验证码======');

        if (this.data.smsCode != _res.data) {
          wx.showToast({ title: '短信验证码无效', icon: 'none' })
        } else {

          wx.showLoading({ title: '提交中...' })

          if (!this.data.id) {
            // 实名认证
            userService.certification({
              // 微信用户ID
              wxMiniUserId: app.globalData.authInfo?.user_info?.id,
              // 开放ID
              wxMiniOpenid: app.globalData.authInfo?.openid,
              // 统一ID
              wxUnionid: app.globalData.authInfo?.unionId,
              // 用户姓名
              name: this.data.name,
              // 性别
              gender: this.data.gender ? this.data.gender : 1,
              // 证件类型
              // certType: this.data.certType ? this.data.certType : 0,
              // 证件号码
              certNo: this.data.certNo,
              // 证件照正面
              certFront: this.data.certFront,
              // 证件照背面
              certBack: this.data.certBack,
              // 出生日期
              birth: this.data.birth ? this.data.birth : null,
              // 手机号码
              phone: this.data.phone,
              // 辖区编码
              areaId: this.data.areaId,
              // 机构编码
              orgCode: this.data.orgCode,
              // 地址
              address: this.data.address,
              // 从业证书
              certImg: this.data.certImg,
              // 医师资格证号
              certNum: this.data.certNum,
              // 证书签发日期
              issued: this.data.issued ? this.data.issued : null,
              // 执业范围
              scope: this.data.scope,
              // 短信验证码
              smsCode: this.data.smsCode,
              // 备注
              remark: this.data.remark,
            }).then((_response: any) => {
              if (_response.code == 200) {
                // 响应数据
                const data = _response.data;

                // 获取业务平台用户信息
                wx.showToast({ title: '认证完成', icon: 'success' });
              } else {
                wx.hideLoading();
                wx.showToast({ title: '认证失败:' + (_response.errors ? _response.errors : _response.message), icon: 'none' })
              }
            }, (_reject: any) => {
              wx.hideLoading()
              wx.showToast({ title: "认证被拒:" + _reject, icon: "none" })
            }).catch((_res: any) => {
              wx.hideLoading();
              wx.showToast({ title: "认证出错:" + _res.message, icon: "none" })
            });
          } else {
            // 实名认证
            userService.certification({
              // 客户ID
              id: this.data.id,
              // 微信用户ID
              wxMiniUserId: app.globalData.authInfo?.user_info?.id,
              // 开放ID
              wxMiniOpenid: app.globalData.authInfo?.openid,
              // 统一ID
              wxUnionid: app.globalData.authInfo?.unionId,
              // 用户姓名
              name: this.data.name,
              // 性别
              gender: this.data.gender ? this.data.gender : 1,
              // 证件类型
              // certType: this.data.certType ? this.data.certType : 0,
              // 证件号码
              certNo: this.data.certNo,
              // 证件照正面
              certFront: this.data.certFront,
              // 证件照背面
              certBack: this.data.certBack,
              // 出生日期
              birth: this.data.birth ? this.data.birth : null,
              // 手机号码
              phone: this.data.phone,
              // 辖区编码
              areaId: this.data.areaId,
              // 机构编码
              orgCode: this.data.orgCode,
              // 地址
              address: this.data.address,
              // 从业证书
              certImg: this.data.certImg,
              // 医师资格证号
              certNum: this.data.certNum,
              // 证书签发日期
              issued: this.data.issued ? this.data.issued : null,
              // 执业范围
              scope: this.data.scope,
              // 短信验证码
              smsCode: this.data.smsCode,
              // 备注
              remark: this.data.remark,
              // 行版本
              rowVersion: this.data.rowVersion
            }).then((_response: any) => {

              wx.showToast({ title: "编辑成功", icon: "none" })

            }, (_reject: any) => {
              wx.hideLoading()
              wx.showToast({ title: "暂不支持编辑:" + _reject, icon: "none" })
            }).catch((_res: any) => {
              wx.hideLoading();
              wx.showToast({ title: "暂不支持编辑:" + _res.message, icon: "none" })
            });
          }

        }
      }
    });
  },

  /**
   * 用户服务协议
   * @param _e 
   */
  onUserServiceAgree(_e: any) {
    wx.navigateTo({ url: '/pages/user-service-agree/user-service-agree' })
  },
  /**
   * 隐私政策
   * @param _e 句柄
   */
  onPrivacyStatement(_e: any) {
    wx.navigateTo({ url: '/pages/privacy-state/privacy-state' })
  }
})