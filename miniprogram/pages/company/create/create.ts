// pages/company/create/create.ts
import Message from '../../../miniprogram_npm/tdesign-miniprogram/message/index';

import AREA_STORAGE_API from '../../../storages/sys-area-storage';
import DIC_STORAGE_API from '../../../storages/dic-storage';
import tenantService from "../../../services/tenant-service";

// 获取应用实例 
const app = getApp<IAppOption>()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    industry: [] as string[],
    industryText: "",
    industryPickerVisable: false,
    scale: [] as string[],
    scaleText: "",
    scalePickerVisable: false,
    area: [] as string[],
    areaText: "",
    areaPickerVisable: false,
    areaOptions: [],
    industryOptions: [
      { label: '互联网', value: 1 },
      { label: '制造业', value: 2 },
      { label: '金融业', value: 3 }
    ],
    scaleOptions: [ // 人员规模选项
      { label: '1-50人', value: 1 },
      { label: '51-100人', value: 2 },
      { label: '101-500人', value: 3 },
    ],
  },

  onLoad(_options: any) {

    wx.showLoading({ title: '加载中...' })

    // 回调函数
    let _authCallback = (_authInfo?: CommonType.IAuthViewModel | null) => {

      if (_authInfo) {
        // TODO: 业务处理

        this.init()

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
  },

  /**
   * 初始化
   */
  init() {
    // 所属区域
    AREA_STORAGE_API.getSysAreaStorage().then((_res: any) => {

      console.log(_res, '区域数据');
      this.setData({ areaOptions: _res })
    });

    // 所属行业字典
    DIC_STORAGE_API.getDicByCategoryCode('sshy_type').then((_res: Array<any>) => {
      this.setData({ industryOptions: _res })
    });

    // 人员规模字典
    DIC_STORAGE_API.getDicByCategoryCode('rygm_type').then((_res: Array<any>) => {
      this.setData({ scaleOptions: _res })
    });
  },

  // 企业名称变化，更新data
  onCompanyNameChange(e: CustomerDetailEvent) {
    this.setData({
      name: e.detail.value.trim()
    })
  },

  // 用户点击提交
  handleSubmit() {
    if (!this.data.name) {
      Message.error({
        context: this,
        closeBtn: true,
        content: '请填写企业名称',
      });
      return;
    }

    tenantService.add({
      // 名称
      name: this.data.name,
      // 区域
      area: this.data.area,
      // 所属行业
      industry: this.data.industry && this.data.industry.length ? +this.data.industry[0] : 0,
      // 企业规模
      staffSize: this.data.scale && this.data.scale.length ? +this.data.scale[0] : 0,
    }).then((_res: any) => {
      if (_res.code == 200) {

      }
    })
  },

  //#region area 相关

  // 点击cell按钮，打开选择器
  onAreaPicker() {
    this.setData({ areaPickerVisable: true })
  },
  // 点击选择器确定，更新data
  onAreaChange(e: CustomerDetailEvent<{ label: string[], value: string[] }>) {
    this.setData({
      areaText: e.detail.label.join(),
      area: e.detail.value,
    })
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

    this.setData({
      [`${name}`]: value,
      [`${name}Text`]: selectedOptions?.map((x: any) => x.label)?.join(',')
    });
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

  //#endregion

  //#region 行业 相关

  // 点击cell按钮，打开选择器
  onIndustryPicker() {
    this.setData({ industryPickerVisable: true })
  },
  // 点击选择器确定，更新data
  onIndustryChange(e: CustomerDetailEvent<{ label: string[], value: string[] }>) {
    this.setData({
      industryText: e.detail.label.join(),
      industry: e.detail.value,
    })
  },
  //#endregion

  //#region 规模 相关

  // 点击cell按钮，打开选择器
  onScalePicker() {
    this.setData({ scalePickerVisable: true })
  },
  // 点击选择器确定，更新data
  onScaleChange(e: CustomerDetailEvent<{ label: string[], value: string[] }>) {
    this.setData({
      scaleText: e.detail.label.join(),
      scale: e.detail.value,
    })
  },
  //#endregion
})