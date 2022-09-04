##  WX-DRAG-IMG
wx-drag-img是基于微信小程序原生语法的图片拖拽排序组件  
![](https://img-blog.csdnimg.cn/fe44a8e54326473c89a3ed98a0da35f1.gif#pic_center)

### 使用组件
1. 通过npm安装：`npm i wx-drag-img`
2. 点击微信开发者工具 -> 工具 -> 构建npm
3. 修改页面json文件
  ```json
  {
    "usingComponents": {
      "WxDragImg": "wx-drag-img"
    }
  }
  ```
4. 接着就可以在wxml中直接使用组件
  ```html
  <WxDragImg
    defaultImgList="{{imgList}}"
    bind:updateImageList="updateImageList"
  >
    <view slot="upload" >...</view>
  </WxDragImg>
  ```

### API
#### Props

|  参数   | 说明  |  类型   | 默认值  |
|  ----  | ----  |  ----  | ----  |
| previewSize  | 图片大小，单位px | Number | 100 |
| defaultImgList  | 初始化图片src数组，用于回显 | Array<string> | [ ] |
| maxCount  | 图片上传数量限制 | Number | 9 |
| columns  | 列数 | Number | 3 |
| gap  | 图片间隔，单位px | Number | 9 |
| deleteStyle  | 删除样式 | String | '' |

#### Slot

| 名称 | 说明 |
| ---- | ----  |
| upload  | 图片上传区域 |

#### Event

|  名称   | 说明  | 回调参数 |
|  ----  | ----  | ----  |
| `bind:updateImageList`  | 图片数组新增、删除、拖拽后 | `event.detail.list`：更新后的图片数组 |

