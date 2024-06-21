
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请选择'
    },
    headline: {
      type: String,
      value: '请选择'
    },
    /**
     * 选择器的标题，仅安卓可用
     */
    headerText: {
      type: String,
    },
    /**
     * 选择器类型
     */
    mode: {
      type: String,
      value: 'selector',
      observer: function (_newVal: any, _oldVal: any, _changePath: any) {
        // const _this = this;

        if (_newVal != _oldVal) {
          this.isValueEmpty(_newVal, this.properties.value);
        }
      }
    },
    /**
     * 是否禁用
     */
    disabled: {
      type: Boolean,
      value: false,
    },
    /**
     * mode 为 selector 或 multiSelector 时，range 有效
     */
    range: {
      type: Array,
      value: [],
      observer: (_newVal: any, _oldVal: any, _changePath: any) => {
        if (_newVal != _oldVal) {

        }
      }
    },
    /**
     * 时间选择器：mode = time
     * 表示有效时间范围的开始，字符串格式为"hh:mm"
     * 日期选择器：mode = date
     * 表示有效日期范围的开始，字符串格式为"YYYY-MM-DD"
     */
    start: {
      type: String,
    },
    /**
     * 时间选择器：mode = time
     * 表示有效时间范围的结束，字符串格式为"hh:mm"
     * 日期选择器：mode = date
     * 表示有效日期范围的结束，字符串格式为"YYYY-MM-DD"
     */
    end: {
      type: String
    },
    /**
     * 有效值 year,month,day，表示选择器的粒度
     */
    fields: {
      type: String,
      value: 'day'
    },
    /**
     * 当 range 是一个 Object Array 时，通过 range-key 来指定 Object 中 key 的值作为选择器显示内容
     */
    rangeKey: {
      type: String
    },
    /**
     * 表示选择了 range 中的第几个（下标从 0 开始）
     */
    value: {
      type: null,
      observer: function (_newVal: any, _oldVal: any, _changePath: any) {
        // const _this = this;

        if (!_newVal && typeof _newVal != 'number') {
          this.isValueEmpty(this.properties.mode);
        } else if (!_oldVal && _newVal) {
          this.isValueEmpty(this.properties.mode, _newVal);
        } else if (_newVal != _oldVal && !Array.isArray(_newVal)) {
          this.isValueEmpty(this.properties.mode, _newVal);
        } else if (_newVal != _oldVal && Array.isArray(_newVal) && Array.isArray(_newVal) && _newVal.length != 0 && _oldVal.length != 0) {
          this.isValueEmpty(this.properties.mode, _newVal);
        }
      }
    },
    /**
     * 省市区选择器
     * 可为每一列的顶部添加一个自定义的项
     */
    customItem: {
      type: String,
    },
    /**
     * 省市区选择器
     * 选择器层级
     */
    level: {
      type: String,
      value: 'region'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /**
     *是否为空
     */
    isEmpty: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * value 改变时触发 change 事件，event.detail = {value}
     * @param _event 参数
     */
    onChange(_event: any) {
      const _newVal = _event.detail;
      // 判断数据状态
      this.isValueEmpty(this.properties.mode, _newVal.value);
      // 触发事件
      this.triggerEvent('change', _newVal);
    },
    /**
     * 取消选择时触发
     * @param _event 参数
     */
    onCancel(_event: any) {
      this.triggerEvent('cancel', _event.detail);
    },
    /**
     * 列改变时触发
     * @param _event 
     */
    onColumnChange(_event: any) {
      this.triggerEvent('columnchange', _event.detail);
    },
    /**
     * 检查是否存在值
     * @param _mode mode
     * @param _newVal value
     */
    isValueEmpty(_mode: string, _newVal?: any) {
      switch (_mode) {
        // 普通选择器
        case 'selector':
          if (!_newVal && _newVal != 0) {
            this.setData({ value: 0, isEmpty: true })
          } else {
            this.setData({ isEmpty: false });
          }
          break;
        // 多列选择器
        case 'multiSelector':
          if (!_newVal || !Array.isArray(_newVal) || !_newVal.length) {
            this.setData({ value: [], isEmpty: true })
          } else {
            this.setData({ isEmpty: false });
          }
          break;
        // 时间选择器
        case 'time':
          if (!_newVal) {
            this.setData({ value: '', isEmpty: true })
          } else {
            this.setData({ isEmpty: false });
          }
          break;
        // 日期选择器
        case 'date':
          if (!_newVal) {
            this.setData({ value: undefined, isEmpty: true })
          } else {
            this.setData({ isEmpty: false });
          }
          break;
        // 省市区选择器
        case 'region':
          if (!_newVal || !Array.isArray(_newVal) || !_newVal.length) {
            this.setData({ value: [], isEmpty: true })
          } else {
            this.setData({ isEmpty: false });
          }
          break;
        default:
          break;
      }
    }
  }
})
