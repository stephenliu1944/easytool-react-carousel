# @easytool/react-carousel
Use for development JS library.

## Install

## Usage

## API

## License

## 项目介绍
该项目脚手架用于开发纯JS库, 支持打包为 UMD, ESModule(esm), CommonJS(cjs) 格式.

### 项目依赖
```
node:    v8.x.x
npm:     v6.x.x
rollup:  v1.x.x
eslint:  v5.x.x
babel:   v7.x.x
gulp:    v4.x.x
jest:   v23.x.x
```

### 使用教程
从git拉取项目代码后, 执行:
```
npm install
```

### 注册和登陆
```
npm adduser      // 注册账号, 执行后会依次提示输入用户名, 密码, 邮箱.
npm login        // 登录npm服务.
```

### 模块配置
1. 在 package.json 中对模块的相关信息进行配置, 参考npm官方文档.
2. name 为模块的名字, libraryName 为UMD格式打包后的全局变量名, 这两项为必填.

### 服务配置
本地服务端口默认为8080, 在 package.json > devEnvironments > servers > local 中可修改端口配置.

### 本地调试
1. 开发阶段执行 bin/startup.bat 启动开发服务器, 模块开发过程中可在 src/dev.js 文件中模拟外部使用模块的情况进行本地调试.
2. 开发完成后可以在 bin/test.bat 执行单元测试.(需先在test/目录进行单元测试编码, 测试框架为jest).

### link调试
1. 将模块引入到项目中调试执行 bin/link , 然后在需要引入模块的项目中执行 npm link 模块名.
2. 如需与项目联调, 可以执行 bin/package-watch, 即可实时打包.

### 打包发布
1. 发布X版本号执行 bin/publish-major.bat, 表示有重大更新, 并且不兼容老的版本.
2. 发布Y版本号执行 bin/publish-minor.bat, 表示有功能更新, 并且兼容老的版本.
3. 发布Z版本号执行 bin/publish-patch.bat, 表示有bug修复, 并且兼容老的版本.
4. 发布预发布版本号执行 bin/publish-prerelease.bat, 表示该版本还在开发测试中, 可能会有较大改动.
5. 从服务端卸载模块执行 bin/unpublish.bat.

### 目录结构
```
bin                                         // 可执行命令目录.
|-build-dev.bat                             // 将src目录中的源码通过 rollup.config.dev.js 编译到build目录.
|-build-prod.bat                            // 将src目录中的源码通过 rollup.config.prod.js 编译到build目录.
|-git-push.bat                              // 更新 git 版本号.
|-link.bat                                  // 执行 npm link, 用于关联到项目调试.
|-lint.bat                                  // 执行eslint生产环境代码校验.
|-package.bat                               // 将src目录中的源码通过 rollup.config.prod.js 编译到dist目录.
|-package-watch.bat                         // 用于关联到项目时联调持续打包.
|-publish-major.bat                         // 发布新X版本.
|-publish-minor.bat                         // 发布新Y版本.
|-publish-patch.bat                         // 发布新Z版本.
|-publish-prerelease.bat                    // 发布预发布版.
|-startup.bat                               // 启动开发环境web服务(window)
|-startup.sh                                // 启动开发环境web服务(linux)
|-test.bat                                  // 执行jest单元测试(window)
|-test.sh                                   // 执行jest单元测试(linux)
|-unpublish.bat                             // 用于从服务端下架模块
build                                       // 代码编译后生成的临时目录
dist                                        // 代码打包后生成的临时目录
src                                         // 项目源码目录
|-constants                                 // 常量文件.
    |-common.js                             // 常用常量.
|-_utils                                    // 模块内部工具文件.
    |-common.js                             // 常用工具库.
|-module1                                   // 模块组件1
    |-index.js                              // 组件的索引文件, 便于外部快速引用.
    |-module1.js                            // js模块文件.
|-module2                                   // 模块组件2
    |-index.js                              // 组件的索引文件, 便于外部快速引用.
    |-module2.js                            // js模块文件.
|-index.js                                  // 模块打包时的入口js文件.
|-dev.js                                    // 本地调试使用的模块引入文件.
|-template.html                             // 开发调试页面模板文件.
test                                        // 测试代码目录, 目录结构同src
.eslintignore                               // eslint忽略校验配置文件.
.eslintrc.json                              // eslint开发环境代码校验配置文件.
.eslintrc.prod.json                         // eslint生产环境代码校验配置文件, 比开发环境更加严格, 发版和提交代码时会自动执行此配置校验代码.
.gitignore                                  // git忽略提交配置文件.
package.json                                // npm配置文件.
README.md                                   // 项目开发文档.
babel.config.js                             // babel配置文件.
fileTransformer.js                          // jest单元测试时的文件转换器.
jest.config.js                              // jest单元测试配置.
gulpfile.js                                 // 项目打包, 发布脚本.
rollup.config.dev.js                        // rollup开发环境配置文件.
rollup.config.prod.js                       // rollup生产环境配置文件.
```

