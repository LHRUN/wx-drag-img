const _ = require('./util')
let comp = null
const mockImg = [
  'https://s1.ax1x.com/2022/12/05/zyq7Bn.jpg',
  'https://s1.ax1x.com/2022/10/30/xI2sQP.jpg'
]
const mockTouch = [
  {
    x: 20,
    y: 20
  },
  {
    x: 170,
    y: 20
  }
]

beforeAll(() => {
  const componentId = _.load('../src/index')
  comp = _.render(componentId, {
    defaultImgList: mockImg
  })
  const parent = document.createElement('parent-wrapper')
  comp.attach(parent)
})

afterAll(() => {
  comp.detach()
})


test('render component', () => {
  const { dragImgList, uploadPosition, columns, previewSize, gap } = comp.data
  expect(comp.data.dragImgList[0].id).toBe(0)
  expect(comp.data.dragImgList[1].id).toBe(1)

  const uploadTranX = dragImgList.length % columns * (previewSize + gap)
  expect(uploadPosition.tranX).toBe(uploadTranX)
})

test('No trigger longPress', () => {
  comp.instance.touchMove({
    touches: [{
      pageX: mockTouch[1].x,
      pageY: mockTouch[1].y
    }],
    mark: {
      key: 0
    }
  })
  expect(comp.data.currentIndex).toBe(-1)
})

test('trigger longPress', () => {
  comp.instance.longPress({
    touches: [{
      pageX: mockTouch[0].x,
      pageY: mockTouch[0].y
    }],
    mark: {
      index: 0
    }
  })
  expect(comp.data.currentIndex).toBe(0)
})

test('trigger touchMove', () => {
  comp.instance.touchMove({
    touches: [{
      pageX: mockTouch[1].x,
      pageY: mockTouch[1].y
    }],
    mark: {
      key: 0
    }
  })
  expect(comp.data.dragImgList[0].key).toBe(1)
})

test('trigger touchEnd', () => {
  comp.instance.touchEnd()
  expect(comp.data.currentIndex).toBe(-1)
})

test('delete img', () => {
  comp.instance.deleteImg({
    mark: {
      key: 0
    }
  })
  expect(comp.data.dragImgList.length).toBe(1)
})

test('upload img', async () => {
  comp.instance.uploadImage()
  await _.sleep(100)
  expect(comp.data.dragImgList.length).toBe(2)
})
