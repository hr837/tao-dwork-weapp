
import config from '../../../config/base';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      observer: function (_newVal: any, _oldVal: any, _changePath: any) {
        if (_newVal != _oldVal) {
          if (_newVal.indexOf('http') > -1) {
            this.setData({ imgUrl: `${_newVal}` })
          } else {
            this.setData({ imgUrl: `${config.mediaUrl}/${_newVal}` })
          }
        }
      }
    },
    /**
     * 模式
     */
    mode: {
      type: String,
      value: 'aspectFill',
    },
    /**
     * 圆角
     */
    borderRadius: {
      type: String,
      value: 'unset'
    },
    /**
     * 是否可预览
     */
    preview: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     *  预览图片
     * @param _event 参数
     */
    onPreviewImage(_event: any) {
      // 判断图片是否存在
      if (this.data.imgUrl) {
        // 预览图片
        wx.previewImage({ urls: [this.data.imgUrl], current: this.data.imgUrl })
      }
    },
  }
})
