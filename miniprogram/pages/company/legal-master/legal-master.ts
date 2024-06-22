import { UploadFile } from "../../../miniprogram_npm/tdesign-miniprogram/upload/type";

// pages/company/legal-master/legal-master.ts
Page({
  data: {
    name: '',
    gender: '',
    idCard: '',
    hukouAddress: '',
    currentAddress: '',
    contact: '',
    idCardFront: '', // 假设用于存储身份证正面图片的链接或ID
    idCardBack: '', // 假设用于存储身份证反面图片的链接或ID
    _companyId: '',
    frontFiles: [] as UploadFile[],
    backFiles: [] as UploadFile[]
  },
  onLoad(query: { id: string }) {
    this.setData({ _companyId: query.id });
  },

  // 处理姓名输入
  onNameInput(e: CustomerDetailEvent) {
    this.setData({
      name: e.detail.value
    });
  },

  // 处理性别输入
  onGenderInput(e: CustomerDetailEvent) {
    this.setData({
      gender: e.detail.value
    });
  },

  // 处理身份证号输入
  onIdCardInput(e: CustomerDetailEvent) {
    this.setData({
      idCard: e.detail.value
    });
  },

  // 处理户籍地址输入
  onHukouAddressInput(e: CustomerDetailEvent) {
    this.setData({
      hukouAddress: e.detail.value
    });
  },

  // 处理现居地址输入
  onCurrentAddressInput(e: CustomerDetailEvent) {
    this.setData({
      currentAddress: e.detail.value
    });
  },

  // 处理联系方式输入
  onContactInput(e: CustomerDetailEvent) {
    this.setData({
      contact: e.detail.value
    });
  },

  // 处理身份证正面上传
  onIdCardFrontUpload(e) {
    // 假设 e.detail.value 是上传成功后返回的图片链接或ID
    this.setData({
      idCardFront: e.detail.value
    });
  },
  onIdCardFrontAdd(e: CustomerDetailEvent<{ files: [UploadFile] }>) {
    this.setData({ frontFiles: e.detail.files })
  },
  // 处理身份证正面删除
  onIdCardFrontRemove() {
    this.setData({ frontFiles: [], idCardFront: '' })
  },

  // 处理身份证反面上传
  onIdCardBackUpload(e) {
    // 同上
    this.setData({
      idCardBack: e.detail.value
    });
  },
  // 处理身份证反面上传
  onIdCardBackAdd(e: CustomerDetailEvent<{ files: [UploadFile] }>) {
    this.setData({ backFiles: e.detail.files })
  },
  // 处理身份证反面删除
  onIdCardBackRemove() {
    this.setData({ backFiles: [], idCardBack: '' })
  },

  // 提交表单
  onSubmit() {
    // 在这里添加提交表单的逻辑
    console.log('Form submit:', this.data);
    // 可以在这里发送数据到服务器或执行其他操作
  },

  // 进入下一步
  onNext() {
    // 在这里添加进入下一步的逻辑
    console.log('Go to next step');
    // 可以在这里更新页面状态或导航到另一个页面
  }
});