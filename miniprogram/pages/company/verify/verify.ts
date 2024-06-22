// pages/company/verify/verify.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _companyId: "",
    // 完成标志
    _flag: {
      master: false,
      base: false,
      ce: false
    },
    _agreed: false,
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query: { id: string }) {
    this.setData({ _companyId: query.id })
  },

  // 提交认证
  handleSubmit() {
    if (!this.data._agreed) {
      wx.showToast({
        title: '请先同意协议',
        icon:"none"
      })
      return;
    }

    wx.showLoading({
      title: '认证中...',
      mask: true
    })

    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({ title: '认证成功' })
      wx.switchTab({ url: "/pages/index/index" });
    }, 3000);
  },

  // 法人信息点击
  onCellLegalMasterClick() {
    const queryStr = "?id=" + this.data._companyId;
    wx.navigateTo({
      url: "../legal-master/legal-master" + queryStr,
      // events:
    })
  },
  // 企业基本信息点击
  onCellBaseInfoClick() {
    const queryStr = "?id=" + this.data._companyId;
    wx.navigateTo({ url: "../base-info/base-info" + queryStr })
  },
  // 证书信息点击
  onCellUploadCeClick() {
    const queryStr = "?id=" + this.data._companyId;
    wx.navigateTo({ url: "../upload-certificate/upload-certificate" + queryStr })
  },
  // 条款checkbox状态更改
  onApproveChange(e: CustomerDetailEvent<{ checked: boolean }>) {
    this.setData({ _agreed: e.detail.checked })
  }
})