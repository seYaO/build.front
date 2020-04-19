# 开发注意点

- `seajs.use` 换成 `seajs.require`
- 路径加载只有 `./path/to/module` 或者 `../../../../module` 这两种方式


## 步骤

在安装之前请先切换到公司内部[npm仓库](http://10.14.40.51:8090/pages/viewpage.action?pageId=557916)

``` bash
# 安装依赖
npm install

# 开启服务

npm run dev

# 构建(部署正式环境)
npm run build

# 测试环境部署
npm run deploy

```

