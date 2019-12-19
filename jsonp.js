function jsonp(url, jsonpCallback, sucess) {
  let script = document.createElement('script')
  script.src = url
  script.async = true
  script.type = 'text/javascript'
  window[jsonpCallback] = function(data) {
    // 成功的回调
    sucess && sucess(data)
  }
  document.body.appendChild(script)
}

// 使用 jsonp
jsonp('http://XXX', 'callback', function(value) {
  console.log(value)
})
