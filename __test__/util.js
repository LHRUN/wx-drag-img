const simulate = require('miniprogram-simulate')
const path = require('path')

const oldLoad = simulate.load
simulate.load = function(componentPath, ...args) {
  if (typeof componentPath === 'string') {
    componentPath = path.join(__dirname, componentPath)
  }
  return oldLoad(componentPath, ...args)
}

global.wx.chooseMedia = function() {
  const res = {}
  res.tempFiles = [{
    tempFilePath: 'https://cdn.v2ex.com/avatar/0add/5f0d/554663_xlarge.png?m=1648803270'
  }]

  return res
}

module.exports = simulate
