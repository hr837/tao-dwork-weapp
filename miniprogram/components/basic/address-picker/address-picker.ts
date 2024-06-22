import mapService from "../../../services/map-service";
import config from '../../../config/base';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 数据
     */
    value: {
      type: Object,
      observer: function (_newVal: any, _oldVal: any, _changePath: any) {
        this.setData({ areas: _newVal })

        // 显示行政区更新
        if (_newVal) {
          this.setData({ areaStr: _newVal.map((_x: any) => _x.name).join(' ') })
        }
      }
    },
    /**
     * 是否定位
     */
    isLocation: {
      type: Boolean,
      value: true
    },
    /**
     * 地图选点位置信息
     */
    location: {
      type: Object,
      observer: function (_newVal: any, _oldVal: any, _changePath: any) {
        if (_newVal == _oldVal) {
          return;
        }

        if (_newVal) {
          // 校验位置是否
          const address: any = this.data.address;
          if (address) {
            // 校验位置是否为统一位置
            if (_newVal.latitude == address.latitude && _newVal.longitude == address.longitude) {
              return;
            }
          }

          // 地址信息格式化
          if (_newVal.address) {
            _newVal.address = _newVal.address.replace(_newVal.province, '').replace(_newVal.city, '').replace(_newVal.district, '');
          }

          this.setData({ address: _newVal, addressStr: _newVal.address });
          this.getLocation(_newVal.latitude, _newVal.longitude, (_areas?: Array<any>) => {
            // 比较值变更
            if (!this.valueEqualCheck(this.data.areas as any, _areas as any)) {
              this.setData({ areas: _areas as any })
            }

            this.triggerEvent('change', { value: { areas: this.data.areas, location: this.data.address } });
          })
        } else {
          // this.setData({ areas: undefined })
          // this.triggerEvent('change', { value: undefined, location: _newVal });
        }
      }
    },
    /**
     * 级别
     */
    level: {
      type: Number,
      value: 2
    },
    /**
     * 是否显示位置
     */
    showLocation: {
      type: Boolean,
      value: true
    },
    /**
     * 文本宽
     */
    labelWidth: {
      type: Number,
      value: 190
    },
    /**
     * 省市区文本
     */
    areaText: {
      type: String,
      value: '省市区'
    },
    /**
     * 地址文本
     */
    locationText: {
      type: String,
      value: '详细地址'
    },
    /**
     * 输入框地址文字
     * 可以直接设置这个属性来指定文本初始内容
     */
    addressStr: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /**
     * 是否显示选择组件
     */
    show: false,
    /**
     * 行政区字符串
     */
    areaStr: undefined,
    /**
     * 行政区
     */
    areas: undefined,
    /**
     * 位置信息
     */
    address: undefined,
    /**
     * 地址
     */
    addressStr: '',
    /**
     * 经度
     */
    lng: 0,
    /**
     * 纬度
     */
    lat: 0,
    /**
     * 定位Promise
     */
    locationPromise: undefined
  },

  lifetimes: {
    attached() {
    },
    detached() {
    },
    /**
     * 视图层布局完成
     */
    ready() {
    },
    /**
     * 被移动到节点树另一个位置
     */
    moved() {
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击省市区事件
     * @param _event 参数
     */
    onSelectArea(_event: any) {
      // 选择数据
      this.setData({ show: true });
    },
    /**
     * 省市区改变事件
     * @param _event 参数
     */
    onAreasChange(_event: any) {
      const value = _event.detail.value;


      // 判断是否需要关闭浮层
      if (value && value.length == this.properties.level + 1) {
        this.setData({ show: false });

        // 比较值变更
        if (!this.valueEqualCheck(this.data.areas as any, value)) {
          // 清空地址信息
          this.setData({ address: undefined, addressStr: '' });

          // 数据
          this.setData({ areas: value, areaStr: value.map((x: any) => x.name ? x.name : x.fullname).join(' ') })
          // 选择数据
          this.triggerEvent('change', { value: { areas: value, location: this.data.address } })
        }
      }
    },

    /**
     * 关闭行政区选择
     * @param _event 参数
     */
    onAreasClose(_event: any) {
      const value = _event.detail.value;

      // 显示
      this.setData({ show: false });

      // 比较值变更
      if (!this.valueEqualCheck(this.data.areas as any, value)) {
        // 清空地址信息
        this.setData({ address: undefined, addressStr: '' })
        // 显示
        this.setData({ areas: value, areaStr: value ? value.map((x: any) => x.name ? x.name : x.fullname).join(' ') : '' });
        // 触发关闭事件
        this.triggerEvent('close', { value: { areas: value, location: this.data.address } });
      }
    },

    /**
     * 输入框变更事件
     * @param _event 参数
     */
    onInputValueChange(_event: any) {
      const name = _event.currentTarget.dataset.name;
      this.setData({ [`${name}`]: _event.detail.value });
    },
    /**
     * 地址输入框失去焦点
     * @param _event 参数
     */
    onAddressBlur(_event: any) {
      const addressStr = this.data.addressStr;
      // 判断地址是否存在
      if (addressStr) {
        const address = this.data.address as any;
        if (address) {
          if (address.address != addressStr) {
            address.address = addressStr;
            this.setData({ address: address })
          }
        } else {
          this.setData({ address: { address: addressStr } as any })
        }
      } else {
        this.setData({ address: undefined })
      }

      // 选择数据
      this.triggerEvent('change', { value: { areas: this.data.areas, location: this.data.address } })
    },
    /**
     * 选择地址
     * @param _event 参数
     */
    onSelectAddress(_event: any) {
      // 注册打开位置事件，用户页面注册数据来源
      this.triggerEvent('location');

      let location;
      const address: any = this.data.address
      if (address) {
        const latitude = address.latitude;
        const longitude = address.longitude;
        if (latitude && longitude) {
          location = JSON.stringify({ latitude: latitude, longitude: longitude });
        }
      }
      const category = '生活服务,娱乐休闲';
      let pluginUrl;
      if (location) {
        pluginUrl = `plugin://chooseLocation/index?key=${config.map.key}&referer=${config.map.referer}&location=${location}&category=${category}`;
      } else {
        pluginUrl = `plugin://chooseLocation/index?key=${config.map.key}&referer=${config.map.referer}&category=${category}`;
      }

      wx.navigateTo({ url: pluginUrl });
    },

    /**
     * 获取定位
     */
    getLocation(_lat: string, _lng: string, _callback?: (params?: Array<any>) => void) {
      const _this = this;

      _this.setData({
        locationPromise: new Promise((_resolve, _reject) => {
          mapService.getAddressByLocation(`${_lat},${_lng}`).then((_locationRes: any) => {
            if (_locationRes.code == 200) {
              const data = _locationRes.data;
              if (data && data.ad_info) {
                const adcodes: any = [];

                const adcode = data.ad_info.adcode;
                // 循环补位处理
                const count = Math.ceil(adcode.length / 2);
                for (let index = 0; index < count; index++) {
                  adcodes.push(adcode.substr(0, (index + 1) * 2).padEnd(6, '0'))
                }

                // 获取行政区
                mapService.search(adcodes.join(',')).then((_areaRes: any) => {
                  if (_areaRes.code == 200) {
                    // 选中更新
                    _resolve(_areaRes.data);
                  } else {
                    _resolve(null);
                  }
                }).catch((_err: any) => {
                  _reject(null);
                });
              } else {
                _resolve(null);
              }
            } else {
              _resolve(null);
            }
          }).catch((_err: any) => {
            _reject(null);
          });
        }) as any
      });

      // 数据更新
      (_this.data.locationPromise as any).then((_areaRes: any) => {
        _this.setData({
          areas: _areaRes,
          areaStr: _areaRes.map((x: any) => {
            return x.name ? x.name : x.fullname
          }).join(' ')
        });
        // 回调
        if (_callback) {
          _callback(_areaRes);
        }
      }).catch((_err: any) => {
        // 回调
        if (_callback) {
          _callback();
        }
      })
    },
    /**
     * 比较值是否相等
     * @param _newVal 新值
     * @param _oldVal 旧值
     */
    valueEqualCheck(_newVal: Array<any>, _oldVal: Array<any>): boolean {
      let valueNotChange = true;
      if ((_newVal && !_oldVal) || (!_newVal && _oldVal)) {
        valueNotChange = false;
        return valueNotChange;
      }

      if (_newVal && _oldVal && _newVal.length != _oldVal.length) {
        valueNotChange = false;
        return valueNotChange;
      }

      if (_newVal && _oldVal && _newVal.length == _oldVal.length) {
        _newVal.forEach((x: any, index: number) => {
          if (x.id != _oldVal[index].id) {
            valueNotChange = false;
            return;
          }
        })
      }

      return valueNotChange;
    }
  }
})
