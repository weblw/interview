function myInstanceof(left, right) {
  let prototype = right.prototype
  left = left.__proto__
  while (true) {
    if (left === null || left === undefined) return false
    if (prototype === left) return true
    left = left.__proto__
  }
}

/* 
  实现分析：
    首先获取类型的原型
    然后获取对象的原型
    接着一直循环判断对象的原型是否等于类型的原型
    直到原型为 null ，因为原型链最终为 null
*/
