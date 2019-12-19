;(function(modules) {
  function require(id) {
    const module = { express: {} }
    modules[id](module, module.exports, require)
    return module.exports
  }
  require('./entry.js')
})({
  './entry.js': function(module, exports, require) {
    'use strict'

    require('./1')
    require('./2')
  }
})
