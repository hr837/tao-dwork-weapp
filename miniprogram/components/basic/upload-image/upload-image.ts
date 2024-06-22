import config from '../../../config/base';
import { uploadFile } from '../../../services/file-upload-service'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 值
     */
    value: {
      type: String,
      observer: function (_newVal: any, _oldVal: any, _changePath: any) {
        if (_newVal != _oldVal) {
          this.setData({ imgUrl: _newVal })
        }
      }
    },
    /**
     * 提示信息
     */
    placeholder: {
      type: String,
      value: '添加图片',
    },
    /**
     * 业务类型
     */
    busType: {
      type: String,
    },
    /**
     * OCR文件类型
     * 0：未知；1：身份证正面照；2：身份证背面照；3：营业执照；4：驾驶证；5；行驶证
     */
    ocrType: {
      type: Number,
      value: 0
    },
    /**
     * 是否显示删除按钮
     */
    showDelete: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /**
     * 多媒体服务地址
     */
    mediaUrl: config.apiUrl,
    /**
     * 图片ID
     */
    imgKey: '',
    /**
     * 图片地址
     */
    imgUrl: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 选择图片点击事件
     * @param _event 参数
     */
    onChoosePicture: function (_event: any) {
      var _this = this;

      wx.chooseMedia({
        count: 1, // 默认9，设置头像选择一张即可
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
        success: function (res: WechatMiniprogram.ChooseMediaSuccessCallbackResult) {
          if (res.tempFiles) {
            wx.showLoading({ title: '加载中...' })

            // 上传图片
            uploadFile({
              filePath: res.tempFiles[0].tempFilePath,
              name: 'file',
            })
              .then((res: any) => {
                wx.hideLoading();

                console.log(res, '文件信息==========')

                let filePath;
                const fileRes = JSON.parse(res);
                if (fileRes) {
                  filePath = fileRes.data.filePath;
                  _this.setData({ imgKey: _event.currentTarget.dataset.id, imgUrl: filePath })
                  // console.log(fileRes.data, '文件信息===');
                  // 注册事件
                  _this.triggerEvent('change', { value: filePath, ocrInfo: fileRes.data.ocrInfo });
                }
              }).catch((_res: any) => {
                wx.hideLoading();
              });
          }
        },
        fail: function (_res: any) {
        },
        complete: function (_res: any) {

        }
      })
    },
    /**
     * 预览图片
     * @param _event 参数
     */
    onPreviewImage(_event: any) {
      if (this.data.imgUrl) {
        const imgUrl = `${this.data.mediaUrl}/${this.data.imgUrl}`;

        // 预览图片
        wx.previewImage({
          urls: [imgUrl],
          current: imgUrl
        })
      }
    },
    /**
     * 关闭事件
     * @param _event 参数
     */
    onClose(_event: any) {
      this.setData({ imgUrl: '' });

      // 触发事件
      this.triggerEvent('change', { value: '', ocrInfo: null });
    }
  }
})
