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
    if (value instanceof MyPromise) {
      return value.then(resolve, reject)
    }
    setTimeout(() => {
      if (that.state === PENDING) {
        that.state = RESOLVE
        that.value = value
        that.resolveCallbacks.map(cb => cb(that.value))
      }
    }, 0)
  }
  function reject(value) {
    if (value instanceof MyPromise) {
      return value.then(resolve, reject)
    }
    setTimeout(() => {
      if (that.state === PENDING) {
        that.state = REJECT
        that.value = value
        that.rejectCallbacks.map(cb => cb(that.value))
      }
    }, 0)
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

  // 兼容多中promise
  function resolutionProcedure(promise2, x, resolve, reject) {
    // x 不能和 promise2 相等
    if (promise2 === x) {
      return reject(new TypeError('Error'))
    }
    // 判断 x 类型
    if (x instanceof MyPromise) {
      x.then(function(value) {
        resolutionProcedure(promise2, value, resolve, reject)
      }, reject)
    }
    let called = false
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        let then = x.then
        if (typeof then === 'function') {
          then.call(
            x,
            y => {
              if (called) return
              called = true
              resolutionProcedure(promise2, y, resolve, reject)
            },
            e => {
              if (called) return
              called = true
              reject(e)
            }
          )
        } else {
          resolve(x)
        }
      } catch (e) {
        if (called) return
        called = true
        reject(e)
      }
    }
  }

  if (that.state === PENDING) {
    // 返回新的promise对象
    return (promise2 = new MyPromise((resolve, reject) => {
      that.resolveCallbacks.push(() => {
        try {
          const x = onFulfilled(that.value)
          // 解决程序
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)
        }
      })
      that.rejectCallbacks.push(() => {
        try {
          const x = onRejected(that.value)
          // 解决程序
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)
        }
      })
    }))
  }
  if (that.state === RESOLVE) {
    return (promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onFulfilled(that.value)
          // 解决程序
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (reason) {
          reject(reason)
        }
      })
    }))
  }
  if (that.state === REJECT) {
    return (promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onRejected(that.value)
          // 解决程序
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (reason) {
          reject(reason)
        }
      })
    }))
  }
}

let p = new MyPromise(resolve => {
  setTimeout(() => {
    resolve(1)
  }, 0)
})
p.then(ret => {
  console.log(ret)
})
