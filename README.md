[English](./README.md) | 简体中文

# Ant Design Pro

开箱即用的中台前端/设计解决方案。

![](https://gw.alipayobjects.com/zos/rmsportal/xEdBqwSzvoSapmnSnYjU.png)

## 模板

```
- Dashboard
  - 分析页
  - 监控页
  - 工作台
- 表单页
  - 基础表单页
  - 分步表单页
  - 高级表单页
- 列表页
  - 查询表格
  - 标准列表
  - 卡片列表
  - 搜索列表（项目/应用/文章）
- 详情页
  - 基础详情页
  - 高级详情页
- 结果
  - 成功页
  - 失败页
- 异常
  - 403 无权限
  - 404 找不到
  - 500 服务器出错
- 帐户
  - 登录
  - 注册
  - 注册成功
```

## 目录结构

```
├── mock                     # 本地模拟数据
├── public
│   └── favicon.ico          # Favicon
├── src
│   ├── assets               # 本地静态资源
│   ├── common               # 应用公用配置，如导航信息
│   ├── components           # 业务通用组件
│   ├── layouts              # 通用布局
│   │   ├── BasicLayout.js       # 基础页面布局，包含了头部导航，侧边栏和通知栏
│   │   ├── BlankLayout.js       # 空白的布局
│   │   ├── PageHeaderLayout.js  # 带有标准 PageHeader 的布局
│   │   └── UserLayout.js        # 抽离出用于登陆注册页面的通用布局
│   ├── models               # dva model
│   ├── routes               # 业务页面入口和常用模板
│   ├── services             # 后台接口服务
│   ├── utils                # 工具库
│   ├── theme.js             # 主题配置
│   ├── index.ejs            # HTML 入口模板
│   ├── index.js             # 应用入口
│   ├── index.less           # 全局样式
│   └── router.js            # 路由入口
├── README.md
└── package.json
```

## 使用

```bash
$ git clone https://github.com/ant-design/ant-design-pro.git --depth=1
$ cd ant-design-pro
$ npm install
$ npm start         # 访问 http://localhost:8000
$ npm run build     # 打包
```

## 兼容性

现代浏览器及 IE11。

