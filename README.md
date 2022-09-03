##  WX-DRAG-IMG
wx-drag-img是基于微信小程序原生语法的图片拖拽排序组件
![](https://img-blog.csdnimg.cn/c1e580964b2447f7b0795c0353c50513.gif#pic_center)

### 使用组件
1. 通过npm安装：`npm i wx-drag-img`
2. 点击微信开发者工具 -> 工具 -> 构建npm
3. 使用组件的页面json文件
  ```json
  {
    "usingComponents": {
      "wxDragImg": "wx-drag-img"
    }
  }
  ```
4. 接着就可以在wxml中直接使用组件
  ```html
  <img-drag
    columns="{{3}}"
    maxCount="{{9}}"
    defaultImgList="{{imgList}}"
    bind:updateImage="updateImage"
  >
    <view slot="delete" >...</view>
    <view slot="upload" >...</view>
  </img-drag>
  ```

### API
#### Props

|  参数   | 说明  |  类型   | 默认值  |
|  ----  | ----  |  ----  | ----  |
| previewSize  | 图片大小，单位px | Number | 100 |
| defaultImgList  | 初始化图片数组，用于回显 | Array<string> | [ ] |
| maxCount  | 图片上传数量限制 | Number | 9 |
| columns  | 列数 | Number | 3 |
| gap  | 图片间隔，单位px | Number | 9 |

#### Slot

| 名称 | 说明 |
| ---- | ----  |
| delete  | 右上角删除icon |
| upload  | 图片上传区域 |

#### Event

|  名称   | 说明  | 回调参数 |
|  ----  | ----  | ----  |
| `bind:updateImageList`  | 图片数组新增、删除、拖拽后 | `event.detail.file`：更新后的图片数组 |

