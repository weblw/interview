function* foo(x) {
  let y = 2 * (yield x + 1)
  let z = yield y / 3
  return x + y + z
}
let it = foo(5)
// next传参会被忽略 yield (x+1) 5
console.log(it.next())
// next参数等于上一个 yield 的返回值 不传参返回undefined
console.log(it.next(12))
// next参数会传递给 z
console.log(it.next(13))

// 使用 generator 解决回调地狱
function* fetch() {
  yield ajax(url1, () => {})
  yield ajax(url2, () => {})
  yield ajax(url3, () => {})
}
let it = fetch()
let ret1 = it.next()
let ret2 = it.next()
let ret3 = it.next()
