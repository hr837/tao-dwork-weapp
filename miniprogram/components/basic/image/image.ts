// import config from '../../../config/base';
// import { uploadFile } from '../../../services/file-upload-service'

// Component({
//   /**
//    * 组件的属性列表
//    */
//   properties: {
//     /**
//      * 提示信息
//      */
//     placeholder: {
//       type: String,
//       value: '添加图片',
//     },
//     /**
//      * 业务类型
//      */
//     busType: {
//       type: String,
//     },
//     /**
//      * OCR文件类型
//      * 0：未知；1：身份证正面照；2：身份证背面照；3：营业执照；4：驾驶证；5；行驶证
//      */
//     ocrType: {
//       type: Number,
//       value: 0
//     },
//     /**
//      * 数据
//      */
//     value: {
//       type: String,
//       observer: function (_newVal: any, _oldVal: any, _changePath: any) {
//         if (_newVal != _oldVal) {
//           this.setData({ imgUrl: _newVal })
//         }
//       }
//     },
//     /**
//      * 是否显示删除按钮
//      */
//     showDelete: {
//       type: Boolean,
//       value: true
//     },

//   },

//   /**
//    * 组件的初始数据
//    */
//   data: {
//     lists: [0] as any,
//     /**
//      * 多媒体服务地址
//      */
//     mediaUrl: config.mediaUrl,
//     /**
//      * 图片ID
//      */
//     imgKey: '',
//     /**
//      * 图片地址
//      */
//     imgUrl: '',
//     show: true,
//   },

//   /**
//    * 组件的方法列表
//    */
//   methods: {

//     //添加
//     addList: function () {
//       var lists = this.data.lists;
//       var newData = {};
//       lists.push(newData);//实质是添加lists数组内容，使for循环多一次
//       this.setData({
//         lists: lists,
//       })
//     },
//     /**
//          * 删除图片
//          * @param e 参数
//          */
//     deleteList(e: any) {
//       var _this = this
//       const currentIndex = e.currentTarget.dataset.index;
//       const lists = _this.data.lists;

//       // 删除图片
//       for (var index = 0; index < lists.length; index++) {
//         if (index == currentIndex) {
//           lists.splice(index, 1)
//           _this.setData({ lists: lists })
//           // 注册事件
//           _this.triggerEvent('change', { value: lists });
//           break;
//         }
//       }
//     },
//     // //删除
//     // delList: function () {
//     //   var lists = this.data.lists;
//     //   lists.pop();      //实质是删除lists数组内容，使for循环少一次
//     //   this.setData({
//     //     lists: lists,
//     //   })
//     // }
//     /**
//      * 选择图片点击事件
//      * @param _event 参数
//      */
//     onChooseImg: function (_event: any) {
//       var _this = this;
//       wx.chooseMedia({
//         count: 1, // 默认9，设置头像选择一张即可
//         sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
//         sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
//         success: function (res: WechatMiniprogram.ChooseMediaSuccessCallbackResult) {
//           if (res.tempFiles) {
//             wx.showLoading({ title: '加载中...' })
//             // 上传图片
//             uploadFile({
//               filePath: res.tempFiles[0].tempFilePath,
//               name: 'file',
//               query: {
//                 projectId: config.mediaAppId,
//                 directoryName: _this.data.busType,
//                 fileName: '',
//                 containsDate: false,
//                 isTemp: false,
//                 isCompress: false,
//                 ocrType: _this.data.ocrType,
//               }
//             })
//               .then((res: any) => {
//                 wx.hideLoading();

//                 let filePath;
//                 const fileRes = JSON.parse(res);
//                 if (fileRes) {
//                   filePath = fileRes.data.filePath;
//                   _this.setData({ imgKey: _event.currentTarget.dataset.id, imgUrl: filePath, show: false })

//                   // 注册事件
//                   _this.triggerEvent('change', { value: filePath, ocrInfo: fileRes.data.ocrInfo });
//                 }
//               }).catch((_res: any) => {
//                 wx.hideLoading();
//               });
//           }
//         },
//       })
//       // this.setData({ show: false })
//     },
//     /**
//      * 预览图片
//      * @param _event 参数
//      */
//     onPreviewImage(_event: any) {
//       if (this.data.imgUrl) {
//         const imgUrl = `${this.data.mediaUrl}/${this.data.imgUrl}`;

//         // 预览图片
//         wx.previewImage({
//           urls: [imgUrl],
//           current: imgUrl
//         })
//       }
//     },
//     /**
//      * 关闭事件
//      * @param _event 参数
//      */
//     onClose(_event: any) {
//       this.setData({ imgUrl: '', show: true });

//       // 触发事件
//       this.triggerEvent('change', { value: '', ocrInfo: null });
//     }
//   }
// })

// components/image-upload/image-upload.ts

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
     * 预览图片
     * @param _event 参数
     */
    onPreviewImage(_event: any) {
      if (this.data.imgUrls) {
        const imgUrl = `${this.data.mediaUrl}/${this.data.imgUrls}`;

        // 预览图片
        wx.previewImage({
          urls: [imgUrl],
          current: imgUrl
        })
      }
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

  }
})
