// func 使用户传入的需要防抖的函数
// await 是等待时间
const debounce=(func,await=50)=>{
  // 缓存一个定时器 id
  let timer=0
  // 这里返回的函数是每次用户实际调用的防抖函数
  // 如果已经设定过定时器了就清空上一次的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  return function(...args){
    if(timer) clearInterval(timer)
    timer=setTimeout(()=>{
      func.apply(this,args)
    },await)
  }
}