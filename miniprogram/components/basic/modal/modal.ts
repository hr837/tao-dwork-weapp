// components/basic/modal/modal.ts
Component({
  /**
   * 选项
   */
  options: {
    /**
     * 多插槽支持
     */
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 是否显示
     */
    isShow: {
      type: Boolean,
      value: false,
      observer: function (_newVal: any, _oldVal: any, _changePath: any) {
      }
    },
    /**
     * 标题
     */
    title: {
      type: String,
      value: '提示'
    },
    /**
     * 提示信息
     */
    message: {
      type: String,
      value: '提示内容'
    },
    /**
     * 按钮是否显示
     */
    cancelIsShow:{
      type: Boolean,
      value: true,
    },
    /**
     * 取消按钮文字
     */
    cancelText: {
      type: String,
      value: '否',
    },
    /**
     * 确认按钮文字
     */
    confirmText: {
      type: String,
      value: '是',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 确认
     * @param _event 句柄
     */
    onConfirm(_event: any) {
      this.triggerEvent('confirm');
    },

    /**
     * 取消
     * @param _envet 句柄
     */
    onCancel(_envet: any) {
      this.triggerEvent('cancel');
    }
  }
})
