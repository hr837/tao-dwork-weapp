// pages/company/create/create.ts
import Message from '../../../miniprogram_npm/tdesign-miniprogram/message/index';

import DIC_STORAGE_API from '../../../storages/dic-storage';
import tenantService from "../../../services/tenant-service";

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
    industryOptions: [
      { label: '互联网', value: 1 },
      { label: '制造业', value: 2 },
      { label: '金融业', value: 3 }
    ], // 示例选项
    areaOptions: [
      { label: '华北', value: 'HB' },
      { label: '东北', value: 'DB' },
      { label: '西南', value: 'XN' },
      { label: '西北', value: 'XB' }
    ],
    scaleOptions: [ // 人员规模选项
      { label: '1-50人', value: 1 },
      { label: '51-100人', value: 2 },
      { label: '101-500人', value: 3 },
    ],
  },

  onLoad(_options: any) {

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
      area: this.data.area && this.data.area.length ? this.data.area[0] : '',
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