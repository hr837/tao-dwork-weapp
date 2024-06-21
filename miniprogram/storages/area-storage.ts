import AREA_API from '../services/area-service'

// wx.setStorage(wx.setStorageSync)
// wx.getStorage(wx.getStorageSync)
// wx.clearStorage(wx.clearStorageSync)

const storageKey = 'AREA_KEY';

const setAreaStorage: any = () => {
  // 获取自定义数据
  return AREA_API.getAreaList(2);
}

/**
 * 获取辖区缓存数据
 */
const getAreaStorage: Function = (): Promise<any> => {
  // 参数处理
  const areaStorage = wx.getStorageSync(storageKey);

  return new Promise((_resolve, _reject) => {
    if (areaStorage) {
      _resolve(areaStorage);
    } else {
      setAreaStorage().then((_response: any) => {
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
    getAreaStorage().then((_res: any) => {
      if (_res) {
        const _casecadeItems: Array<any> = [];
        const _splitCodes = _code.split('$');

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
  getAreaStorage,
  getCasecadeItemByCode,
}