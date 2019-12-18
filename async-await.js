let a = 0
let b = async () => {
  // a=0 会被保存下来 同步代码执行之后，再拿出来继续执行
  a = a + (await 10)
  console.log('2', a)
}
b()
a++
console.log('1', a)
