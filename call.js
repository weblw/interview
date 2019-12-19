Function.prototype.myCall = function(context) {
  // this 就是 myCall 的调用者，如果不是函数，报错
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  // 如果不传上下文，默认为window
  context = context || window
  context.fn = this
  // 剥离参数
  const args = [...arguments].slice(1)
  const result = context.fn(...args)
  delete context.fn
  return result
}
