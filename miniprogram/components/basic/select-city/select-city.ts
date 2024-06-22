import mapService from "../../../services/map-service";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 是否显示
     */
    show: {
      type: Boolean,
      value: false,
      observer: function (_newVal: any, _oldVal: any, _changePath: any) {

        // 判断是否回收容器
        if (_newVal) {
          this.setData({ isRecycle: false })
        }
      }
    },
    /**
     * 值
     * {id: adcode,name:''}
     */
    value: {
      type: Array,
      observer: function (_newVal: any, _oldVal: any, _changePath: any) {
        if (_newVal != _oldVal && !this.valueEqualCheck(_newVal, _oldVal, this.data.selected as any)) {
          const selected: any[] = [];
          // 选中数据
          const selectedValue: Array<{ [key: string]: any }> = _newVal;
          if (selectedValue.length > 0 && selectedValue[0].id) {
            // 定位
            this.getLocation((_areas?: Array<any>) => {
              // 加载省份数据
              this.loadProvince((provinces: Array<any>) => {
                if (provinces) {
                  const provinceId = selectedValue[0].id;
                  const province: any = provinces.find((x: any) => x.id == provinceId);
                  selected.push(province);

                  // 城市
                  if (this.properties.level > 0) {
                    // if (!this.data.cityPromise) {
                    this.setData({ cityPromise: mapService.getChildren(province.id) });
                    // }
                    (this.data.cityPromise as any).then((_citiesRes: any) => {
                      if (_citiesRes.code == 200) {
                        const cities = _citiesRes.data;
                        this.setData({ cities: cities });
                        if (selectedValue.length > 1) {
                          const cityId = selectedValue[1].id;
                          const city: any = cities.find((x: any) => x.id == cityId);
                          selected.push(city);

                          // 县区
                          if (this.properties.level > 1) {
                            // if (!this.data.districtPromise) {
                            this.setData({ districtPromise: mapService.getChildren(city.id) });
                            // }
                            (this.data.districtPromise as any).then((_districtsRes: any) => {
                              if (_districtsRes.code == 200) {
                                const districts = _districtsRes.data;
                                this.setData({ districts: districts });
                                if (selectedValue.length > 2) {
                                  const districtId = selectedValue[2].id;
                                  const district: any = districts.find((x: any) => x.id == districtId);
                                  district.name = district.fullname;
                                  selected.push(district);

                                  // 选中值更新 
                                  this.setData({ selected: selected as any })

                                  if (this.data.currentLevel < selected.length - 1) {
                                    this.setData({ currentLevel: selected.length - 1 })
                                  }

                                  // 选择数据
                                  this.triggerEvent('change', { value: selected })
                                } else {
                                  this.setData({ selected: selected as any })

                                  if (this.data.currentLevel <= selected.length - 1) {
                                    this.setData({ currentLevel: 2 > this.data.level ? this.data.level : 2 })
                                  }

                                  // 选择数据
                                  this.triggerEvent('change', { value: selected })
                                }
                              }
                            })
                          } else {
                            this.setData({ selected: selected as any })

                            if (this.data.currentLevel <= selected.length - 1) {
                              this.setData({ currentLevel: 2 > this.data.level ? this.data.level : 2 })
                            }

                            // 选择数据
                            this.triggerEvent('change', { value: selected })
                          }
                        } else {
                          this.setData({ selected: selected as any })

                          if (this.data.currentLevel <= selected.length - 1) {
                            this.setData({ currentLevel: 1 > this.data.level ? this.data.level : 1 })
                          }

                          // 选择数据
                          this.triggerEvent('change', { value: selected })
                        }
                      }
                    })
                  } else {
                    this.setData({ selected: selected as any })

                    if (this.data.currentLevel <= selected.length - 1) {
                      this.setData({ currentLevel: 1 > this.data.level ? this.data.level : 1 })
                    }

                    // 选择数据
                    this.triggerEvent('change', { value: selected })
                  }
                }
              }); // 加载省份数据执行完成
            }); // 定位回调执行完成
          }
        }
      }
    },
    /**
     * 行政区级别
     * 0: 省会；1：城市；2：县区
     */
    level: {
      type: Number,
      value: 2,
      observer: function (_newVal: any, _oldVal: any, _changePath: any) {
        // 
      }
    },
    /**
     * 是否定位
     */
    isLocation: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /**
     * 是否回收容器
     */
    isRecycle: true,
    /**
     * 搜索内容
     */
    inputSearch: '',
    /**
     * 热门城市
     */
    hotcityList: [
      { id: 110000, city: '北京' },
      { id: 310000, city: '上海' },
      { parent: 440000, id: 440100, city: '广州' },
      { parent: 440000, id: 440300, city: '深圳' },
      { parent: 330000, id: 330100, city: '杭州' },
      { parent: 320000, id: 320100, city: '南京' },
      { parent: 420000, id: 420100, city: '武汉' },
      { id: 120000, city: '天津' },
      { parent: 410000, id: 410100, city: '长沙' },
      { parent: 610100, id: 610100, city: '西安' },
      { id: 500000, city: '重庆' }
    ],
    /**
     * 省会列表
     */
    provinces: [],
    /**
     * 城市
     */
    cities: [],
    /**
     * 县区
     */
    districts: [],
    /**
     * 当前级别
     */
    currentLevel: 0,
    /**
     * 定位纬度
     */
    latitude: 0,
    /**
     * 定位经度
     */
    longitude: 0,
    /**
     * 选中城市
     */
    selected: undefined,
    /**
     * 省会Promise
     */
    provincePromise: undefined,
    /**
     * 城市Promise
     */
    cityPromise: undefined,
    /**
     * 县区Promise
     */
    districtPromise: undefined,
    /**
     * 定位Promise
     */
    locationPromise: undefined,
  },

  /**
   * 生命周期
   */
  lifetimes: {
    /**
     * 组件生命周期函数 - 在组件实例刚刚被创建时执行，注意此时不能调用 setData
     */
    created() {
    },

    /**
     * 组件生命周期函数 - 在组件实例进入页面节点树时执行
     */
    attached() {
    },

    /**
     * 组件生命周期函数 - 在组件布局完成后执行
     * @param _options 
     */
    ready() {
      // 获取省会行政区
      this.loadProvince();

      // 获取定位
      this.getLocation((_areas?: Array<any>) => {
        if (_areas) {

        }
      });
    },

    /**
     * 组件生命周期函数 - 在组件实例被移动到节点树另一个位置时执行
     */
    moved() {
    },

    /**
     * 组件生命周期函数 - 在组件实例被从页面节点树移除时执行
     */
    detached() {
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 关闭
     */
    close() {
      // 关闭事件
      this.triggerEvent('close', { value: this.data.selected });
    },

    /**
     * 进入前触发
     */
    beforeenter() {
    },

    /**
     * 进入中触发
     */
    enter() {
    },

    /**
     * 进入后触发
     */
    afterenter() {
    },

    /**
     * 离开前触发
     */
    beforeleave() {
      // 回收容器资源
      this.setData({ isRecycle: true });
      // 关闭事件
      this.triggerEvent('close', { value: this.data.selected });

      wx.stopLocationUpdate();
    },

    /**
     * 离开中触发
     */
    leave() {
    },

    /**
     * 离开后触发
     */
    afterleave() {
      // 回收容器资源
      this.setData({ isRecycle: true });

    },

    /**
     * 点击遮罩层时触发
     */
    clickoverlay() {
    },

    /**
     * 键盘输入时触发
     * @param _event 参数 
     */
    bindinput(_event: any) {
      const value = _event.detail.value;

      if (value) {
        this.setData({ searchShow: true })
      } else {
        this.setData({ searchShow: false });
      }
    },

    /**
     * 输入框聚焦时触发
     * @param _event 参数 
     */
    bindfocus(_event: any) {
      const value = _event.detail.value;

      if (value) {
        this.setData({ searchShow: true })
      } else {
        this.setData({ searchShow: false });
      }
    },

    /**
     * 输入框失去焦点
     * @param _event 参数 
     */
    bindblur(_event: any) {
      const value = _event.detail.value;
    },

    /**
     * 点击完成按钮事件
     */
    bindconfirm(_event: any) {
      const value = _event.detail.value;
    },

    /**
     * 搜索项点击事件
     * @param _event 参数
     */
    searchItemTap(_event: any) {
      this.setData({ searchShow: false });
    },

    /**
     * 点击热门城市事件
     * @param _event 参数
     */
    onHotCity(_event: any) {
      const _this = this;
      const dataset = _event.currentTarget.dataset;
      const areas: Array<any> = [];

      // 获取城市编码
      if (dataset) {
        if (dataset.parent) {
          areas.push({ id: dataset.parent })
        }
        areas.push({ id: dataset.id });

        // 初始化当前行政区级别
        _this.setData({ currentLevel: 0 });

        // 更新选择数据
        // 省份
        _this.selectedChange(areas[0].id, 0, (_isSuccess: boolean) => {
          if (_isSuccess) {
            if (areas.length > 1 && areas[1] && _this.properties.level > 0) {
              // 城市
              _this.selectedChange(areas[1].id, 1, (_isSuccess: boolean) => {
                if (_isSuccess) {
                  // 触发事件
                  _this.triggerEvent("change", { value: _this.data.selected, latitude: _this.data.latitude, longitude: _this.data.longitude });
                }
              });
            } else {
              // 触发事件
              _this.triggerEvent("change", { value: _this.data.selected, latitude: _this.data.latitude, longitude: _this.data.longitude });
            }
          }
        });
      }
    },

    /**
     * 加载省份数据
     * @param _callback 回调函数
     */
    loadProvince(_callback?: (params: Array<any>) => void) {
      const _this = this;

      // 获取省份数据
      const provinces = _this.data.provinces;
      if (provinces && provinces.length) {
        if (_callback) {
          _callback(provinces);
        }
      } else {
        if (!this.data.provincePromise) {
          const getProvinces = mapService.getByLevel(1);
          this.setData({ provincePromise: getProvinces });
        }

        // 获取省会行政区
        (this.data.provincePromise as any).then((_res: any) => {
          if (_res.code == 200) {
            // 数据初始化
            _this.setData({ provinces: _res.data })

            if (_callback) {
              _callback(_res.data);
            }
          }
        })
          .catch((_err: any) => {

          });
      }
    },

    /**
     * 获取定位
     */
    getLocation(_callback?: (params?: Array<any>) => void) {
      const _this = this;
      if (!_this.data.locationPromise) {
        _this.setData({
          locationPromise: new Promise((_resolve, _reject) => {

            // 判断是否需要获取位置
            if (_this.properties.isLocation) {
              const _locationChangeCallback = (_res: any) => {
                wx.offLocationChange(_locationChangeCallback);
                // 获取位置信息
                if (_res) {
                  let latitude = _res.latitude
                  let longitude = _res.longitude
                  // 经纬度初始化
                  this.setData({ latitude, longitude });
                  // 行政区解析
                  mapService.getAddressByLocation(`${latitude},${longitude}`).then((_locationRes: any) => {
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
                            const areas: Array<any> = _areaRes.data;
                            if (areas && areas.length && areas[0]) {
                              // 选中更新
                              // 省份
                              _this.selectedChange(areas[0].id, 0, (_isSuccess: boolean) => {
                                if (areas.length > 1 && areas[1] && _this.properties.level > 0) {
                                  // 城市
                                  _this.selectedChange(areas[1].id, 1, (_isSuccess: boolean) => {
                                    if (areas.length > 2 && areas[2] && _this.properties.level > 1) {
                                      // 县区
                                      _this.selectedChange(areas[2].id, 2, (_isSuccess: boolean) => {
                                        // 触发事件
                                        _this.triggerEvent("change", { value: _this.data.selected, latitude: _this.data.latitude, longitude: _this.data.longitude });

                                        _resolve(areas.map((x: any) => {
                                          if (!x.name) { x.name = x.fullname; }
                                          return x;
                                        }));
                                      });
                                    } else {
                                      // 触发事件
                                      _this.triggerEvent("change", { value: _this.data.selected, latitude: _this.data.latitude, longitude: _this.data.longitude });

                                      _resolve(areas.map((x: any) => {
                                        if (!x.name) { x.name = x.fullname; }
                                        return x;
                                      }));
                                    }
                                  });
                                } else {
                                  // 触发事件
                                  _this.triggerEvent("change", { value: _this.data.selected, latitude: _this.data.latitude, longitude: _this.data.longitude });
                                  _resolve(areas.map((x: any) => {
                                    if (!x.name) {
                                      x.name = x.fullname;
                                    }
                                    return x;
                                  }));
                                }
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
                      } else {
                        _resolve(null);
                      }
                    } else {
                      _resolve(null);
                    }
                  }).catch((_err: any) => {
                    _reject(null);
                  });
                } else {
                  _reject(null);
                }

                // 关闭位置监听
                wx.stopLocationUpdate();
              };

              // 开始监听位置变化
              wx.startLocationUpdate({
                success: (_res: any) => {
                  // location变更
                  wx.onLocationChange(_locationChangeCallback);
                },
                fail: (_err: any) => {
                  _reject(_err);
                }
              });
            } else {
              _resolve(null);
            }
          }) as any
        });
      }

      // 数据更新
      (this.data.locationPromise as any).then((_areaRes: any) => {
        if (_areaRes) {
          this.setData({ areas: _areaRes });
        }

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
     * 选中项
     * @param _event 参数
     */
    onSelectedChange(_event: any) {
      const _this = this;

      const dataset = _event.currentTarget.dataset;
      const _level = dataset.level;
      const _id = dataset.id;
      // const _name = dataset.name;

      // 选中更新
      _this.selectedChange(_id, _level, (_isSuccess: boolean) => {
        // 触发事件
        if (_isSuccess) {
          _this.triggerEvent("change", { value: _this.data.selected, latitude: _this.data.latitude, longitude: _this.data.longitude })
        }
      });
    },

    /**
     * 选中索引项变更
     * @param _event 参数
     */
    onIndexChange(_event: any) {
      const dataset = _event.currentTarget.dataset;
      const _level = dataset.level;
      const _id = dataset.id;
      const _name = dataset.name;

      // 行政区级别变更
      this.setData({ currentLevel: +_level, selected: (this.data.selected as any).slice(0, _level) });

      // 触发事件
      this.triggerEvent("change", { value: this.data.selected, latitude: this.data.latitude, longitude: this.data.longitude })
    },
    /**
     * 选中项改变
     * @param _id 行政区编码
     * @param _level 级别
     */
    selectedChange(_id: string, _level: number, _callback?: (isSuccess: boolean) => void) {
      const _this = this;
      let selected: Array<any> = [];
      if (_this.data.selected && (_this.data.selected as any).length) {
        selected = _this.data.selected as any
      }

      selected = selected.slice(0, _level + 1);

      const _loadCallback = (_isSuccess?: boolean) => {
        if (!_isSuccess) {
          if (_callback) {
            _callback(false);
          }
          return;
        }

        // 选中值更新
        _this.setData({ selected: selected as any })

        // 级别后移
        if (_this.properties.level > +_level) {
          _this.setData({ currentLevel: _this.data.currentLevel + 1 })

          // 判断当前行政区划级别
          switch (_this.data.currentLevel) {
            case 1:
              const getCities = mapService.getChildren(_id);
              this.setData({ cityPromise: getCities });
              // 加载城市
              (_this.data.cityPromise as any).then((_res: any) => {
                if (_res.code == 200) {
                  _this.setData({ cities: _res.data })
                  if (_callback) {
                    _callback(true);
                  }
                } else {
                  if (_callback) {
                    _callback(false);
                  }
                }
              });
              break;
            case 2:
              const getDistricts = mapService.getChildren(_id);
              this.setData({ districtPromise: getDistricts });
              // 加载县区
              (_this.data.districtPromise as any).then((_res: any) => {
                if (_res.code == 200) {
                  _this.setData({ districts: _res.data })
                  if (_callback) {
                    _callback(true);
                  }
                } else {
                  if (_callback) {
                    _callback(false);
                  }
                }
              });
              break;
            default:
              break;
          }
        } else {
          if (_callback) {
            _callback(true);
          }
        }
      };

      // 判断行政区划级别
      switch (_level) {
        case 0:
          // 加载城市
          (_this.data.provincePromise as any).then((_res: any) => {
            if (_res.code == 200) {
              const selectedProvince = _res.data.find((x: any) => x.id == _id);
              if (!selected || selected.length < 1) {
                selected = [selectedProvince];
              } else {
                selected[0] = selectedProvince;
              }

              // 异步回调
              _loadCallback(true);
            } else {
              // 异步回调
              _loadCallback(false);
            }
          });
          break;
        case 1:
          // 加载城市
          const getCities = mapService.getChildren(selected[0].id);
          this.setData({ cityPromise: getCities });
          (_this.data.cityPromise as any).then((_res: any) => {
            if (_res.code == 200) {
              const selectedCity = _res.data.find((x: any) => x.id == _id);
              if (selected.length < 2) {
                selected.push(selectedCity);
              } else {
                selected[1] = selectedCity;
              }

              // 异步回调
              _loadCallback(true);
            } else {
              // 异步回调
              _loadCallback(false);
            }
          });
          break;
        case 2:
          // 加载县区
          const getDistricts = mapService.getChildren(selected[1].id);
          this.setData({ districtPromise: getDistricts });
          (_this.data.districtPromise as any).then((_res: any) => {
            if (_res.code == 200) {
              const selectedDistrict: any = _res.data.find((x: any) => x.id == _id);
              selectedDistrict.name = selectedDistrict.fullname;

              if (selected.length < 3) {
                selected.push(selectedDistrict);
              } else {
                selected[2] = selectedDistrict;
              }

              // 异步回调
              _loadCallback(true);
            } else {
              // 异步回调
              _loadCallback(false);
            }
          });
          break;
        default:
          break;
      }
    },

    /**
     * 比较值是否相等
     * @param _newVal 新值
     * @param _oldVal 旧值
     * @param _current 当前值
     */
    valueEqualCheck(_newVal: Array<any>, _oldVal: Array<any>, _current: Array<any>): boolean {
      let valueNotChange = true;
      if ((_newVal && !_current) || (!_newVal && _current)) {
        valueNotChange = false;
        return valueNotChange;
      }

      if (_newVal && _current && _newVal.length != _current.length) {
        valueNotChange = false;
        return valueNotChange;
      }

      if (_newVal && _current && _newVal.length == _current.length) {
        _newVal.forEach((x: any, index: number) => {
          if (x.id != _current[index].id) {
            valueNotChange = false;
            return;
          }
        })

        // 两个值不相等
        if (!valueNotChange) {
          return valueNotChange;
        }
      }

      return valueNotChange;
    }
  },
})
