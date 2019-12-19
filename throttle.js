// func 使用户传入的需要节流的函数
// await 是等待时间
const throttle=(func,await=50)=>{
  // 上一次执行该函数的时间
  let lastTime=0
  return function(...args){
    // 当前时间
    let now =+new Date()
    // 将当前时间和上一次函数执行时间对比
    // 如果差值大于设置的等待时间就执行函数
    if(now-lastTime>await){
      lastTime=now
      func.apply(this,args)
    }
  }
}

setInterval(
  throttle(()=>{
    console.log(1)
  },500)
)