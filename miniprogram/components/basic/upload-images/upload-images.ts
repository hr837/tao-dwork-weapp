// components/image-upload/image-upload.ts

import config from "../../../config/base"
import { uploadFile } from "../../../services/file-upload-service"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 业务类型
     */
    busType: {
      type: String,
      value: ''
    },
    /**
     * 占位文字
     */
    placeholder: {
      type: String,
      value: '添加图片/视频'
    },
    /**
     * 值
     */
    value: {
      type: Array,
      observer: function (_newVal: any, _oldVal: any, _changePath: any) {
        if (_newVal != _oldVal) {
          if (_newVal.length != _oldVal.length) {
            this.setData({ imgUrls: _newVal })
          } else {
            for (let index = 0; index < _newVal.length; index++) {
              const element = _newVal[index];
              const oldElement = _oldVal[index];
              if (element != oldElement) {
                this.setData({ imgUrls: _newVal })
                break;
              }
            }
          }
        }
      }
    },
    /**
     * 最多上传图片数
     */
    maxCount: {
      type: Number,
      value: 3
    },
    /**
     * 是否支持预览
     */
    showPreview: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /**
     * 多媒体服务地址
     */
    mediaUrl: config.mediaUrl,
    /**
     * 图片地址
     */
    imgUrls: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 上传图片
     * @param _e 参数
     */
    bindUpload(_e: any) {
      var _this = this

      wx.chooseMedia({
        count: _this.data.maxCount - this.data.imgUrls.length, // 默认 3
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFiles
          for (var index = 0; index < tempFilePaths.length; index++) {
            uploadFile({
              filePath: res.tempFiles[index].tempFilePath,
              name: 'file',
              query: {
                projectId: config.mediaAppId,
                directoryName: _this.data.busType,
                fileName: '',
                containsDate: false,
                isTemp: false,
                isCompress: false
              }
            })
              .then((res: any) => {
                wx.hideLoading();

                let filePath;
                const fileRes = JSON.parse(res);
                if (fileRes) {
                  filePath = fileRes.data.filePath;
                }
                _this.setData({ imgUrls: _this.data.imgUrls.concat(filePath) })

                // 注册事件
                _this.triggerEvent('change', { value: _this.data.imgUrls ? _this.data.imgUrls : '' });
              }).catch((_res: any) => {
                wx.hideLoading();
              });
          }
        }
      })
    },
    /**
     * 删除图片
     * @param e 参数
     */
    deleteImg(e: any) {
      var _this = this
      const currentIndex = e.currentTarget.dataset.index;
      const imgUrls = _this.data.imgUrls;

      // 删除图片
      for (var index = 0; index < imgUrls.length; index++) {
        if (index == currentIndex) {
          imgUrls.splice(index, 1)
          _this.setData({ imgUrls: imgUrls })
          // 注册事件
          _this.triggerEvent('change', { value: imgUrls });
          break;
        }
      }
    },

    bindPreview(_e: any) {
      var _this = this
      if (!_this.data.showPreview) {
        return
      }
      console.log(_e);
      const currentIndex = _e.currentTarget.dataset.index;
      const imgUrls = _this.data.imgUrls;

      let resultArray: string[] = [];
      imgUrls.forEach((path) => {
        resultArray.push(_this.data.mediaUrl + '/' + path);
      });
      console.log(resultArray);

      //预览
      wx.previewImage({
        urls: resultArray,
        current: resultArray[currentIndex]
      })
    },

  }
})
