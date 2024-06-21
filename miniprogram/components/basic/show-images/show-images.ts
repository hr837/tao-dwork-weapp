import config from '../../../config/base';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: null,
      observer: function (_newVal: any, _oldVal: any, _changePath: any) {
        if (_newVal) {
          // 将字符串转数组
          const urls = (_newVal as string).split(',' || ';').map(x => `${config.mediaUrl}/${x}`);
          this.setData({ urls: urls as never[] })
        } else {
          this.setData({ urls: [] })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    urls: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 预览图片
     * @param _event 参数
     */
    onPreviewImage(_event: any) {
      // 判断图片是否存在
      if (this.data.urls && this.data.urls.length) {
        // 当前图片
        const currentUrl = _event.currentTarget.dataset.url;
        // 预览图片
        wx.previewImage({
          urls: this.data.urls,
          current: currentUrl
        })
      }
    },
  }
})
