// pages/company/create/create.ts
import Message from '../../../miniprogram_npm/tdesign-miniprogram/message/index';
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
    enquireDialogVisable: false,
    industryOptions: [
      { label: '互联网', value: 'HLW' },
      { label: '制造业', value: 'ZZY' },
      { label: '金融业', value: 'JRY' }
    ], // 示例选项
    areaOptions: [
      { label: '华北', value: 'HB' },
      { label: '东北', value: 'DB' },
      { label: '西南', value: 'XN' },
      { label: '西北', value: 'XB' }
    ],
    scaleOptions: [ // 人员规模选项
      { label: '1-50人', value: 'S' },
      { label: '51-100人', value: 'M' },
      { label: '101-500人', value: 'L' },
    ],
    _companyId: "",
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
    this.setData({ enquireDialogVisable: true, _companyId: '123456' });

  },

  onDialogConfirm() {
    const queryStr = '?id=' + this.data._companyId;
    wx.navigateTo({ url: '/pages/company/verify/verify' + queryStr, })
  },
  onDialogCancel() {
    wx.switchTab({ url: "/pages/index/index" })
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