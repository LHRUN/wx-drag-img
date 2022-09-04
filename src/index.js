Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    // 图片大小，单位px
    previewSize: {
      type: Number,
      value: 100,
    },
    // 初始化图片数组，用于回显
    defaultImgList: {
      type: Array,
      value: [],
      observer(list) {
        if (list?.length && !this.data.dragImgList.length) {
          const dragImgList = this.getDragImgList(list);
          this.setUploaPosition(dragImgList.length);
          this.setData({
            dragImgList,
          });
        }
      }
    },
    // 图片上传数量限制
    maxCount: {
      type: Number,
      value: 9,
    },
    // 列数
    columns: {
      type: Number,
      value: 3,
    },
    // 图片间隔 单位：px
    gap: {
      type: Number,
      value: 9,
    },
    // 删除样式
    deleteStyle: {
      type: String,
      value: '',
    }
  },
  data: {
    /**
     * 拖拽图片列表
     * {
     *  src: string, // 图片路径
     *  key: number, // 
     *  id: number, // for循环遍历使用, 不会改变, 创建时自增id
     *  tranX: number, // x轴位移距离
     *  tranY: number, // y轴位移距离
     * }[]
     */
    dragImgList: [],
    containerRes: {
      top: 0, // 容器距离页面顶部距离 px
      left: 0, // 容器距离页面左边距离 px
      width: 0, // 容器宽度 px
      height: 0, // 容器高度 px
    }, // 拖拽容器属性
    currentKey: -1, // 正在拖拽图片的key
    currentIndex: -1, // 正在拖拽图片的index
    tranX: 0, // 正在拖拽图片移动的x距离
    tranY: 0, // 正在拖拽图片移动的y距离
    uploadPosition: { // upload上传图标位移距离
      tranX: 0,
      tranY: 0,
    }
  },

  lifetimes: {
    ready() {
      this.createSelectorQuery()
        .select(".drag-container")
        .boundingClientRect(({ top, left }) => {
          this.setData({
            ['containerRes.top']: top,
            ['containerRes.left']: left,
          });
        }).exec();
    }
  },

  methods: {
    /**
     * 长按图片
     */
    longPress(e) {
      const index = e.mark.index;
      const { pageX, pageY } = e.touches[0];
      const { previewSize, containerRes: { top, left } } = this.data;
      this.setData({
        currentIndex: index,
        tranX: pageX - previewSize / 2 - left,
        tranY: pageY - previewSize / 2 - top,
      });
    },

    /**
     * touchMove
     */
    touchMove(e) {
      // 如果currentIndex < 0，说明并没有触发longPress
      if (this.data.currentIndex < 0) {
        return;
      }
      const { pageX, pageY } = e.touches[0];
      const { previewSize, containerRes: { top, left } } = this.data;
      const tranX = pageX - previewSize / 2 - left;
      const tranY = pageY - previewSize / 2 - top;
      this.setData({
        tranX,
        tranY
      });
      // 对比当前移动的key和停放位置的key，如果不一样就修改位置
      const currentKey = e.mark.key;
      const moveKey = this.getMoveKey(tranX, tranY);

      // 当移动的key和正在停放位置的key相等，就无须处理
      if (currentKey === moveKey || this.data.currentKey === currentKey) {
        return;
      }
      this.data.currentKey = currentKey;
      this.replace(currentKey, moveKey);
    },

    /**
     * 计算移动中的key
     * @param tranX 正在拖拽图片的tranX
     * @param tranY 正在拖拽图片的tranY
     */
    getMoveKey(tranX, tranY) {
      const { dragImgList: list, previewSize, columns } = this.data;
      const _getPositionNumber = (drag, limit) => {
        const positionNumber = Math.round(drag / previewSize);
        return positionNumber >= limit ? limit - 1 : positionNumber < 0 ? 0 : positionNumber;
      }
      const endKey = columns * _getPositionNumber(tranY, Math.ceil(list.length / columns)) + _getPositionNumber(tranX, columns);
      return endKey >= list.length ? list.length - 1 : endKey;
    },

    /**
     * 生成拖拽后的新数组
     * @param start 拖拽起始的key
     * @param end 拖拽结束的key
     */
    replace(start, end) {
      const dragImgList = this.data.dragImgList;
      dragImgList.forEach((item) => {
        if (start < end) {
          if (item.key > start && item.key <= end) item.key--;
          else if (item.key === start) item.key = end;
        } else if (start > end) {
          if (item.key >= end && item.key < start) item.key++;
          else if (item.key === start) item.key = end;
        }
      });
      this.getListPosition(dragImgList);
    },

    /**
     * 计算数组的位移位置
     * @param list 拖拽图片数组
     */
    getListPosition(list) {
      const { previewSize, columns, gap } = this.data;
      const dragImgList = list.map((item) => {
        item.tranX = (previewSize + gap) * (item.key % columns);
        item.tranY = Math.floor(item.key / columns) * (previewSize + gap);
        return item;
      })
      this.setData({
        dragImgList,
      });
      this.updateEvent(dragImgList);
    },

    /**
     * touchEnd
     */
    touchEnd() {
      this.setData({
        tranX: 0,
        tranY: 0,
        currentIndex: -1,
      });
      this.data.currentKey = -1;
    },

    /**
     * updateEvent
     * @describe 上传删除拖拽后触发事件把列表数据发给页面
     */
    updateEvent(dragImgList) {
      const list = [...dragImgList].sort((a, b) => a.key - b.key).map((item) => item.src);
        this.triggerEvent('updateImageList', {
          list,
      });
    },

    /**
     * 上传图片
     */
    async uploadImage() {
      let { dragImgList, maxCount } = this.data;
      try {
        const res = await wx.chooseMedia({
          count: maxCount - dragImgList.length,
          mediaType: ['image'],
        });
        const imgList = this.getDragImgList(res?.tempFiles?.map(({ tempFilePath }) => tempFilePath) || [], false);
        dragImgList = dragImgList.concat(imgList);
        this.setUploaPosition(dragImgList.length);
        this.setData({
          dragImgList,
        });
        this.updateEvent(dragImgList);
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 改变图片数量后获取容器宽高
     * @parma listLength 数组长度
     */
    getContainerRect(listLength) {
      const { columns, previewSize, maxCount, gap } = this.data;
      const number = listLength === maxCount ? listLength : listLength + 1;
      const row = Math.ceil(number / columns)
      return {
        width: columns * previewSize + (columns - 1) * gap,
        height: row * previewSize + gap * (row - 1),
      };
    },

    /**
     * 根据图片列表生成拖拽列表数据结构
     * @param list 图片src列表
     * @param init 是否是初始化
     */
     getDragImgList(list, init = true) {
      let { dragImgList, previewSize, columns, gap } = this.data;
      return list.map((item, index) => {
        const i = (init ? 0 : dragImgList.length) + index;
        return {
          tranX: (previewSize + gap) * (i % columns),
          tranY: Math.floor(i / columns) * (previewSize + gap),
          src: item,
          id: i,
          key: i,
        };
      });
    },

    /**
     * 修改上传区域位置
     * @param listLength 数组长度
     */
    setUploaPosition(listLength) {
      const { previewSize, columns, gap } = this.data;
      const uploadPosition = {
        tranX: listLength % columns * (previewSize + gap),
        tranY: Math.floor(listLength / columns) * (previewSize + gap),
      };
      const { width, height } = this.getContainerRect(listLength);
      this.setData({
        uploadPosition,
        ['containerRes.width']: width,
        ['containerRes.height']: height,
      });
    },

    /**
     * 删除图片
     */
    deleteImg(e) {
      const key = e.mark.key;
      const list = this.data.dragImgList.filter((item) => item.key !== key);
      list.forEach((item) => {
        item.key > key && item.key--;
      });
      this.getListPosition(list);
      this.setUploaPosition(list.length);
    },
  }
})