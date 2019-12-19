const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core')

// 实现使用 babel 转换代码
function readCode(filePath) {
  // 读取文件内容
  const content = fs.readFileSync(filePath, 'utf-8')
  // 生成 AST
  const ast = babylon.parse(content, {
    sourceType: 'module'
  })
  // 寻找当前文件的依赖关系
  const dependencies = []
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value)
    }
  })
  // 通过 AST 将代码转为 es5
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })
  return {
    filePath,
    dependencies,
    code
  }
}

// 调用 readCode 函数，传入入口文件
// 分析入口文件的依赖
// 识别 JS 和 CSS 文件
function getDependencies(entry) {
  // 读取入口文件
  const entryObject = readCode(entry)
  const dependencies = [entryObject]
  // 遍历所有文件依赖关系
  for (const asset of dependencies) {
    // 获取目录文件
    const dirname = path.dirname(asset.filePath)
    // 遍历当前文件依赖的关系
    asset.dependencies.forEach(relativePath => {
      // 获取绝对路径
      const absolutePath = path.join(dirname, relativePath)
      // CSS 文件逻辑就是讲代码插入到 style 标签中
      if (/\.css$/.test(absolutePath)) {
        const content = fs.readFileSync(absolutePath, 'utf-8')
        const code = `
          const style=document.createElement('style')
          style.innerText=${JSON.stringify(content).replace(/\\r\\n/g, '')}
          document.head.appendChild(style)
        `
        dependencies.push({
          filePath: absolutePath,
          relativePath,
          dependencies: [],
          code
        })
      } else {
        // JS 代码需要继续查找是否有依赖关系
        const child = readCode(absolutePath)
        child.relativePath = relativePath
        dependencies.push(child)
      }
    })
  }
  return dependencies
}

// 实现打包功能
function bundle(dependencies, entry) {
  let modules = ''
  // 构建函数参数，生成的结构为
  //  { './entry.js': function(module, exports, require) { 代码 } }
  dependencies.forEach(dep => {
    const filePath = dep.relativePath || entry
    modules += `'${filePath}':(
      function (module, exports, require) { ${dep.code} }
    )`
  })
  // 构建 require 函数，目的是为了获取模块暴露出来的内容
  const result = `
    (function(modules){
      function require(id){
        const module={express:{}}
        modules[id](module,module.exports,require)
        return module.exports
      }
      require('${entry}')
    })({${modules}})
  `
  // 将生成的内容写入到文件中
  fs.writeFileSync('./bundle.js', result)
}

function webpack(entry) {
  const dependencies = getDependencies(entry)
  bundle(dependencies, entry)
}

module.exports = webpack
