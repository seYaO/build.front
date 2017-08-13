## 目录结构
```sh
├── .temp                       # 生成的页面模版目录
├── output                      # 编译后前端代码目录&静态资源前端访问目录
|   ├── page/                   # 页面
│   ├── pubilc/                 # 静态文件
│   ├── views/                  # 给开发的页面
│   ├── static/                 # 上传的静态文件
│   └── ...
├── build/                      # 自动化构建配置目录
│   └── ...
├── config/                     # 配置文件目录
│   ├── api-router.js           # api接口路由，本地测试使用
│   ├── entries.js              # 获取所有页面的config.json配置
│   ├── router.js               # 页面的路由配置，根据config.json中的配置
│   ├── proxy.js                # 代理
│   └── ...
├── src/                        # 前端源代码目录
|   ├── modules/                # 通用模块通用模块
|   |   └── ...
|   ├── lib/                    # 库和插件
|   |   ├── jquery/             # 库或插件目录
|   |   |   ├── 1.8.0/          # 版本
|   |   |   └── ...             
|   |   └── ...
|   ├── api/                    # 接口数据，本地测试用
|   |   └── ...
|   ├── sites/                  # 站点目录
|   |   ├── demo/               # 具体页面
|   |   |   ├── img/            # 图片目录
|   |   |   ├── js/             # js模块目录
|   |   |   ├── scss/           # scss模块目录
|   |   |   ├── views/          # 模版目录
|   |   |   ├── config.json     # 页面配置
|   |   |   ├── demo.ftl        # 页面
|   |   |   ├── demo.js         # 脚本
|   |   |   └── demo.scss       # 样式
|   |   └── ...
│   ├── styles/                 # 样式目录(脱离业务逻辑的可直接引用)
|   |   ├── mixins/             # 公共方法
|   |   |   └── ...
|   |   ├── motion/             # 动画
|   |   |   └── ...
|   |   ├── theme/              # 主题
|   |   |   └── ...
│   ├── utils/                  # 工具目录
|   |   └── ...
│   ├── templates/              # 页面的公共模块
|   |   └── ...
├── index.html                  # 所有路由集合页 
├── .babelrc                    # babel config 
├── .gitignore                  # git config 
├── package.json                # npm packager config
├── gulpfile.js                 # gulp task
├── config.js                   # 配置文件
└── app.js                      # 服务入口文件
```

### src/sites/ota/home/config.json
每个页面设置一个`config.json`，主要配置的属性：
- sort          排序
- desc          页面说明
- route         路由  例：`home` 注：最前边不要加`/`
- path          页面路径 例：`/home/home.ftl`
- url           示例地址 集合页展示测试地址使用
- versionsJs    脚本版本号 格式：如 20170707 不可使用(1.0.0)
- versionsCss   样式版本号 格式：同上
- sate          页面上的同步数据，测试用

## 构建命令

所有的命令将通过 [NPM Scripts](https://docs.npmjs.com/misc/scripts) 来执行

```js
// 开发项目
npm run dev

// 生成freemarker文件，上传静态文件
npm run deploy

```


### 说明
- 更新 1.0.2
  - 页面同步数据使用,所有同步数据放到这个`script`中
  ```html
    <script name="text/freemarker">
        var agbState = {
            orderCode: '<%=orderCode%>',
            countDown: '<%=countDown%>',
            accountLeft: '<%=userAmount.cashMoney%>'
        }
    </script>
  ```
- 更新 1.0.1
  - lib(库或插件)：引用方式：`<script src="/lib/jquery/1.8.0/jquery.min.js"></script>`
  - 启用代理时页面集合页是`/pagelist`
  - 代理使用在`config/proxy.js`中进行修改
  - 本地测试接口数据文件`src/api`下，接口路由地址`config/api-router.js`中配置
- 更新 1.0.0
  - 以`.es.js`后缀结尾的脚本可以使用[es6](http://es6.ruanyifeng.com/)语法
  - 模版使用：
    - `<% include ./views/top.ejs %>` 页面使用模块
    - `<%- include('../../templates/cnwidescreenhead.ftl') -%>` 公共模块
    - 注意：上边两种引入方式无法注释掉，注释请用`<%// include ./views/top.ejs %>`
    - `页面模块`生成的时候会合并到页面，`公共模块`会转换为`freemarker`的格式，使用的时候要注意区别
    - 所有模块不支持内部引入其他模块，只可引入到主页面，暂时未解决，后期再研究
  - 资源引用：
    - 脚本样式只能使用`/demo.js`，这样的绝对路径
    - 图片只能使用`/modules/demo/img/demo.png`


