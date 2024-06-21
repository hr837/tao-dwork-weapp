import DICAPI from '../services/dic-service'

// wx.setStorage(wx.setStorageSync)
// wx.getStorage(wx.getStorageSync)
// wx.clearStorage(wx.clearStorageSync)

const setDicStorage: any = () => {
  return DICAPI.getAll();
}

/**
 * 根据分类编码获取缓存列表
 */
const getDicByCategoryCode: Function = (categoryCode: string): Promise<any> => {
  // 参数处理
  const dicStorage = wx.getStorageSync(categoryCode);

  return new Promise((_resolve, _reject) => {
    if (dicStorage) {
      _resolve(dicStorage);
    } else {
      setDicStorage().then((_response: any) => {
        if (_response && _response.data) {
          _response.data.forEach((element: any) => {

            const dataType = element.dataType;

            const children = element.children;

            switch (dataType) {
              case 'number':
                const _numberFunc = (sources: Array<any>): void => {
                  sources?.forEach(x => {
                    // 值类型变更
                    x.value = +x.value;
                    // 下级遍历
                    _numberFunc(x.children);
                  });
                }

                _numberFunc(children);
                break;
              case 'boolean':
                const _booleanFunc = (sources: Array<any>): void => {
                  sources?.forEach(x => {
                    // 值类型变更
                    x.value = x.value.toLowerCase() == 'true' ? true : false;
                    // 下级遍历
                    _booleanFunc(x.children);
                  });
                }

                _booleanFunc(children);
                break;
              default:


                break;
            }

            wx.setStorage({ key: element.value, data: children });
          });

          const dic = _response.data.find((x: any) => x.value === categoryCode);
          if (dic) {
            // 数据类型 字符串-'string' 值类型-'number' 布尔类型-'boolean'
            const dataType = dic.dataType;
            // 下级节点
            const children = dic.children;

            switch (dataType) {
              case 'number':
                const _numberFunc = (sources: Array<any>): void => {
                  sources?.forEach(x => {
                    // 值类型变更
                    x.value = +x.value;
                    // 下级遍历
                    _numberFunc(x.children);
                  });
                }

                _numberFunc(children);
                break;
              case 'boolean':
                const _booleanFunc = (sources: Array<any>): void => {
                  sources?.forEach(x => {
                    // 值类型变更
                    x.value = x.value.toLowerCase() == 'true' ? true : false;
                    // 下级遍历
                    _booleanFunc(x.children);
                  });
                }

                _booleanFunc(children);
                break;
              default:


                break;
            }

            _resolve(children);
          }
        }
      });
    }
  });
}

export default {
  getDicByCategoryCode,
}