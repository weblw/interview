// 通过babel编译的话，可以使用JSX
const a = h(
  'ul',
  { className: 'list' },
  h('li', {}, 'item 1'),
  h('li', {}, 'item 2')
)
const b = h(
  'ul',
  { className: 'list' },
  h('li', {}, 'item 1'),
  h('li', {}, 'hello')
)

const $root = document.getElementById('root')
const $reload = document.getElementById('reload')
const $destory = document.getElementById('destory')

// 首次挂载
updateElement($root, a)
$reload.addEventListener('click', () => {
  // 更新页面
  updateElement($root, b, a)
})
$destory.addEventListener('click', () => {
  const $ul = document.querySelector('ul')
  // 销毁页面
  updateElement($ul, null, a, 0)
})
