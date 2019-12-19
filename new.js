/*
 * new 过程会发生四件事：
 * 1.新生成一个对象
 * 2.链接到原型
 * 3.绑定 this
 * 4.返回新对象
 */
function create() {
  let obj = {}
  let Con = [].shift.call(arguments)
  obj.__ptoto__ = Con.prototype
  let result = Con.apply(obj, arguments)
  return result instanceof Object ? result : obj
}

/* 
  实现分析：
  1、创建一个空对象
  2、获取构造函数
  3、设置空对象的原型
  4、绑定this并执行构造函数
  5、确保返回值为对象 
*/
