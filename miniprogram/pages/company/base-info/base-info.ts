import dayjs from "dayjs";

// pages/company/base-info/base-info.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _companyId: '',
    enterpriseName: '',
    // 企业分类
    enterpriseType: [] as string[],
    enterpriseTypeText: '',
    enterprisePickerVisable: false,
    enterprisePickerOption: [
      { label: '合资企业', value: 'HZQY' },
      { label: '责任公司', value: 'ZRGS' },
    ],
    // 信用代码
    creditCode: '',
    serviceLicense: '',
    businessTerm: '',
    supervisor: '',
    businessScope: '',
    association: '',
    officePhone: '',
    registeredCapital: '',
    registeredAddress: '',
    operationStatus: '',
    jurisdiction: '',
    establishmentDate: '',
    establishmentDateDefault: dayjs().format('YYYY-MM-DD'),
    establishmentDatePickerVisable: false,
    qRCodeText: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query: { id: string }) {
    this.setData({ _companyId: query.id });
  },
  // 企业名称输入
  onEnterpriseNameInput(e: CustomerDetailEvent) {
    this.setData({
      enterpriseName: e.detail.value
    });
  },


  //#region 企业分类选择

  // 处理企业分类更改
  onEnterpriseTypeChange(e: CustomerDetailEvent<{ label: string[], value: string[] }>) {
    this.setData({
      enterpriseType: e.detail.value,
      enterpriseTypeText: e.detail.label.join()
    });
  },
  // 处理企业分类点击
  onEnterpriseTypePick() {
    this.setData({ enterprisePickerVisable: true })
  },

  //#endregion

  // 社会信用代码输入
  onCreditCodeInput(e: CustomerDetailEvent) {
    this.setData({
      creditCode: e.detail.value
    });
  },

  // 服务许可号输入
  onServiceLicenseInput(e: CustomerDetailEvent) {
    this.setData({
      serviceLicense: e.detail.value
    });
  },

  // 营业期限输入
  onBusinessTermInput(e: CustomerDetailEvent) {
    this.setData({
      businessTerm: e.detail.value
    });
  },

  // 监管机构输入
  onSupervisorInput(e: CustomerDetailEvent) {
    this.setData({
      supervisor: e.detail.value
    });
  },

  // 经营范围输入
  onBusinessScopeInput(e: CustomerDetailEvent) {
    this.setData({
      businessScope: e.detail.value
    });
  },

  // 归属协会输入
  onAssociationInput(e: CustomerDetailEvent) {
    this.setData({
      association: e.detail.value
    });
  },

  // 办公电话输入
  onOfficePhoneInput(e: CustomerDetailEvent) {
    this.setData({
      officePhone: e.detail.value
    });
  },

  // 注册资本输入
  onRegisteredCapitalInput(e: CustomerDetailEvent) {
    this.setData({
      registeredCapital: e.detail.value
    });
  },

  // 注册地址输入
  onRegisteredAddressInput(e: CustomerDetailEvent) {
    this.setData({
      registeredAddress: e.detail.value
    });
  },

  // 经营状态输入
  onOperationStatusInput(e: CustomerDetailEvent) {
    this.setData({
      operationStatus: e.detail.value
    });
  },

  // 所在辖区输入
  onJurisdictionInput(e: CustomerDetailEvent) {
    this.setData({
      jurisdiction: e.detail.value
    });
  },

  //#region 成立日期
  // 成立日期输入
  onEstablishmentDateChange(e: CustomerDetailEvent) {
    console.log(e)
    this.setData({
      establishmentDate: e.detail.value
    });
  },
  onEstablishmentDatePick() {
    this.setData({ establishmentDatePickerVisable: true })
  },
  //#endregion

  // 企业二维码输入
  onQRCodeTextInput(e: CustomerDetailEvent) {
    this.setData({
      qRCodeText: e.detail.value
    });
  },


  // ... 其他输入和选择事件处理函数

  // 提交表单
  onSubmit() {
    // 表单提交逻辑
    console.log('Form submit:', this.data);
  },

  // 进入下一步
  onNext() {
    const queryStr = '?id=' + this.data._companyId;
    // 下一步逻辑
    wx.navigateTo({ url: '../upload-certificate/upload-certificate' + queryStr })
  }
})