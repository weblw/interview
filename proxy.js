let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    // receiver 接受者
    // Reflect 参考文档：https://www.jianshu.com/p/4a5eca0536c3
    get(target, property, receiver) {
      getLogger(target, property)
      if (typeof target[property] === 'object' && target[property] !== null) {
        return new Proxy(target[property], handler)
      }
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

let obj = { a: { b: 1 } }
let p = onWatch(
  obj,
  (v, property) => {
    console.log(`监听到属性${property}改变为${v}`)
  },
  (target, property) => {
    console.log(`'${property}' = ${target[property]}`)
  }
)

p.a.b = 2
p.a.b
