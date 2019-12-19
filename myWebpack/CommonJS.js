;(function(modules) {
  function require(id) {
    // 构建一个 CommonJS 导出代码
    const module = { exports: {} }
    // 去参数中获取文件对应函数并执行
    modules[id](module, module.exports, require)
    return module.exports
  }
  require('./entry.js')
})({
  './entry.js': function(module, exports, require) {
    // 这里继续通过构造的 require 去找到 a.js 文件对应函数
    var _a = require('./a.js')
    console.log(_a.default)
  },
  './a.js': function(module, exports, require) {
    var a = 1
    // 将 require 函数中变量 module 变成了这样的结构
    // module.exports = 1
    // 这样就能在外面取到导出的内容了
    exports.default = a
  }
  // 省略
})
