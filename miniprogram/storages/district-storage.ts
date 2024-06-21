import DISTRICT_API from '../services/area-service'

// wx.setStorage(wx.setStorageSync)
// wx.getStorage(wx.getStorageSync)
// wx.clearStorage(wx.clearStorageSync)

const storageKey = 'DISTRICT_KEY';

const setDistrictStorage: any = () => {
  return DISTRICT_API.getAreaList();
}

/**
 * 根据分类编码获取缓存列表
 */
const getDistrictStorage: Function = (): Promise<any> => {
  // 参数处理
  const districtStorage = wx.getStorageSync(storageKey);

  return new Promise((_resolve, _reject) => {
    if (districtStorage) {
      _resolve(districtStorage);
    } else {
      setDistrictStorage().then((_response: any) => {
        if (_response && _response.data) {
          const dataSource = _response.data;
          const rootNodes: Array<any> = dataSource.filter((x: any) => !x.parentCode).map((x: any) => ({ label: x.name, value: x.code, parentValue: x.parentCode }));

          /**
           * 递归构造树结构
           * @param parent 上级节点
           */
          const func = (parent: any) => {
            const children = dataSource.filter((x: any) => x.parentCode == parent.value).map((x: any) => ({ label: x.name, value: x.code, parentValue: x.parentCode }));
            if (children && children.length) {
              parent.children = children;
              // 下级节点
              children.forEach((child: any) => {
                func(child);
              });
            }
          };

          // 递归构造树
          rootNodes.forEach((root: any) => {
            func(root);
          });

          wx.setStorage({ key: storageKey, data: rootNodes });

          // 响应
          _resolve(rootNodes);
        } else {
          _reject('error');
        }
      });
    }
  });
}

/**
 * 根据编码获取层级项
 * @param _code 编码
 */
const getCasecadeItemByCode: Function = (_code: string): Promise<any> => {
  return new Promise((_resolve, _reject) => {
    if (!_code) {
      _reject('error');
    }

    // 参数处理
    getDistrictStorage().then((_res: any) => {
      if (_res) {
        const _casecadeItems: Array<any> = [];
        const _splitCodes = [];
        for (let index = 0; index < _code.length / 2; index++) {
          const _tempParentCode = _code.substr(0, index * 2 + 2);
          const _currentCode = _code.substr(index * 2, 2);
          if (_currentCode == '00') {
            break;
          } else {
            const _parentCode = _tempParentCode.padEnd(_code.length, '0');
            _splitCodes.push(_parentCode);
          }
        }

        // 数据源
        let _dicStorage = _res;
        // 处理数据
        _splitCodes.forEach((_item: any, _index: number) => {
          if (_dicStorage) {
            const _currentItem = _dicStorage.find((x: any) => x.value == _item);
            if (_currentItem) {
              _casecadeItems.push(_currentItem);
              _dicStorage = _currentItem.children;
            }
          }
        });

        _reject(_casecadeItems);
      } else {
        _reject('error');
      }
    });
  });
}

export default {
  getDistrictStorage,
  getCasecadeItemByCode
}