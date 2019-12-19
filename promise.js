const PENDING = 'pending'
const RESOLVE = 'resolve'
const REJECT = 'reject'

function MyPromise(fn) {
  const that = this
  that.state = PENDING
  that.value = null
  that.resolveCallbacks = []
  that.rejectCallbacks = []

  // 实现resolve和reject函数
  function resolve(value) {
    if (that.state === PENDING) {
      that.state = RESOLVE
      that.value = value
      that.resolveCallbacks.map(cb => cb(that.value))
    }
  }
  function reject(value) {
    if (that.state === PENDING) {
      that.state = REJECT
      that.value = value
      that.rejectCallbacks.map(cb => cb(that.value))
    }
  }

  // 执行传入的fn函数
  try {
    fn(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

// 实现then函数
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  const that = this
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : r => {
          throw r
        }
  if (that.state === PENDING) {
    that.resolveCallbacks.push(onFulfilled)
    that.rejectCallbacks.push(onRejected)
  }
  if (that.state === RESOLVE) {
    onFulfilled(that.value)
  }
  if (that.state === REJECT) {
    onRejected(that.value)
  }
}
