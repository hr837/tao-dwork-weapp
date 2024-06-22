import { UploadFile } from "../../../miniprogram_npm/tdesign-miniprogram/upload/type";

// pages/company/upload-certificate/upload-certificate.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _companyId: "",
    businessLicenseFiles: [] as UploadFile[],
    safeLicenseFiles: [] as UploadFile[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query: { id: string }) {
    this.setData({ _companyId: query.id });
  },

  //#region 营业执照相关
  onBussinessLicenseUpload() {
  },
  onBussinessLicenseRemove(e: CustomerDetailEvent<{ index: number }>) {
    const files = this.data.businessLicenseFiles;
    files.splice(e.detail.index, 1);
    this.setData({ businessLicenseFiles: files })
  },
  onBussinessLicenseAdd(e: CustomerDetailEvent<{ files: [UploadFile] }>) {
    const files = this.data.businessLicenseFiles.concat(e.detail.files);
    this.setData({ businessLicenseFiles: files })
  },
  //#endregion

  //#region 安保相关
  onSafeLicenseUpload() {

  },
  onSafeLicenseRemove() {

  },
  onSafeLicenseAdd() {

  },
  //#endregion

  // 处理点击提交
  onSubmit() {
    const query = '?id=' + this.data._companyId;
    wx.navigateTo({ url: "../verify/verify" + query })
  }
})