# ECMAScript 6

## Table of Contents

* 第1章 ECMAScript 6简介
	* ECMAScript 和 JavaScript 的关系
	* ES6 与 ECMAScript 2015 的关系
	* 语法提案的批准流程
	* ECMAScript 的历史
	* 部署进度
	* Babel转码器
	* Traceur转码器
* 第2章 let和const命令
	* let命令
	* 块级作用域
	* const命令
	* 顶层对象的属性
	* global 对象
* 第3章 变量的解构赋值
	* 数组的解构赋值
	* 对象的解构赋值
	* 字符串的解构赋值
	* 数值和布尔值的解构赋值
	* 函数参数的解构赋值
	* 圆括号问题
	* 用途
* 第4章 字符串的扩展
	* 字符的Unicode表示法
	* codePointAt()
	* String.fromCodePoint()
	* 字符串的遍历器接口
	* at()
	* normalize()
	* includes(), startsWith(), endsWith()
	* repeat()
	* padStart()，padEnd()
	* 模板字符串
	* 实例：模板编译
	* 标签模板
	* String.raw()
	* 模板字符串的限制
* 第5章 正则的扩展
	* RegExp构造函数
	* 字符串的正则方法
	* u修饰符
	* y 修饰符
	* sticky属性
	* flags属性
	* RegExp.escape()
	* s 修饰符：dotAll 模式
	* 后行断言
	* Unicode属性类
* 第6章 数值的扩展
	* 二进制和八进制表示法
	* Number.isFinite(), Number.isNaN()
	* Number.parseInt(), Number.parseFloat()
	* Number.isInteger()
	* Number.EPSILON
	* 安全整数和Number.isSafeInteger()
	* Math对象的扩展
	* Math.signbit()
	* 指数运算符
* 第7章 数组的扩展
	* Array.from()
	* Array.of()
	* 数组实例的copyWithin()
	* 数组实例的find()和findIndex()
	* 数组实例的fill()
	* 数组实例的entries()，keys()和values()
	* 数组实例的includes()
	* 数组的空位
* 第8章 函数的扩展
	* 函数参数的默认值
	* rest参数
	* 扩展运算符
	* 严格模式
	* name 属性
	* 箭头函数
	* 绑定 this
	* 尾调用优化
	* 函数参数的尾逗号
* 第9章 对象的扩展
	* 属性的简洁表示法
	* 属性名表达式
	* 方法的 name 属性
	* Object.is()
	* Object.assign()
	* 属性的可枚举性
	* 属性的遍历
	* __proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf()
	* Object.keys()，Object.values()，Object.entries()
	* 对象的扩展运算符
	* Object.getOwnPropertyDescriptors()
	* Null 传导运算符
* 第10章 Symbol
	* 概述
	* 作为属性名的Symbol
	* 实例：消除魔术字符串
	* 属性名的遍历
	* Symbol.for()，Symbol.keyFor()
	* 实例：模块的 Singleton 模式
	* 内置的Symbol值
* 第11章 Set和Map数据结构
	* Set
	* WeakSet
	* Map
	* WeakMap
* 第12章 Proxy
	* 概述
	* Proxy 实例的方法
	* Proxy.revocable()
	* this 问题
	* 实例：Web 服务的客户端
* 第13章 Reflect
	* 概述
	* 静态方法
	* 实例：使用 Proxy 实现观察者模式
* 第14章 Promise 对象
	* Promise 的含义
	* 基本用法
	* Promise.prototype.then()
	* Promise.prototype.catch()
	* Promise.all()
	* Promise.race()
	* Promise.resolve()
	* Promise.reject()
	* 两个有用的附加方法
	* 应用
	* Promise.try()
* 第15章 Iterator和for...of循环
	* Iterator（遍历器）的概念
	* 数据结构的默认Iterator接口
	* 调用Iterator接口的场合
	* 字符串的Iterator接口
	* Iterator接口与Generator函数
	* 遍历器对象的return()，throw()
	* for...of循环
* 第16章 Generator 函数的语法
	* 简介
	* next方法的参数
	* for...of循环
	* Generator.prototype.throw()
	* Generator.prototype.return()
	* yield* 语句
	* 作为对象属性的Generator函数
	* Generator函数的this
	* 含义
	* 应用
* 第17章 Generator 函数的异步应用
	* 传统方法
	* 基本概念
	* Generator 函数
	* Thunk 函数
	* co 模块
* 第18章 async 函数
	* 含义
	* 用法
	* 语法
	* async 函数的实现原理
	* 与其他异步处理方法的比较
	* 实例：按顺序完成异步操作
	* 异步遍历器
* 第19章 Class
	* Class基本语法
	* Class的继承
	* 原生构造函数的继承
	* Class的取值函数（getter）和存值函数（setter）
	* Class 的 Generator 方法
	* Class 的静态方法
	* Class的静态属性和实例属性
	* 类的私有属性
	* new.target属性
	* Mixin模式的实现
* 第20章 修饰器
	* 类的修饰
	* 方法的修饰
	* 为什么修饰器不能用于函数？
	* core-decorators.js
	* 使用修饰器实现自动发布事件
	* Mixin
	* Trait
	* Babel转码器的支持
* 第21章 Module 的语法
	* 概述
	* 严格模式
	* export 命令
	* import 命令
	* 模块的整体加载
	* export default 命令
	* export 与 import 的复合写法
	* 模块的继承
	* 跨模块常量
	* import()
* 第22章 Module 的加载实现
	* 浏览器加载
	* ES6 模块与 CommonJS 模块的差异
	* Node 加载
	* 循环加载
	* ES6模块的转码
* 第23章 编程风格
	* 块级作用域
	* 字符串
	* 解构赋值
	* 对象
	* 数组
	* 函数
	* Map结构
	* Class
	* 模块
	* ESLint的使用
* 第24章 读懂 ECMAScript 规格
	* 概述
	* 相等运算符
	* 数组的空位
	* 数组的map方法
* 第25章 二进制数组
	* ArrayBuffer对象
	* TypedArray视图
	* 复合视图
	* DataView视图
	* 二进制数组的应用
	* SharedArrayBuffer
* 第26章 SIMD
	* 概述
	* 数据类型
	* 静态方法：数学运算
	* 静态方法：通道处理
	* 静态方法：比较运算
	* 静态方法：位运算
	* 静态方法：数据类型转换
	* 实例方法
	* 实例：求平均值
* 第27章 参考链接
	* 官方文件
	* 综合介绍
	* let和const
	* 解构赋值
	* 字符串
	* 正则
	* 数值
	* 数组
	* 函数
	* 对象
	* Symbol
	* Set和Map
	* Proxy 和 Reflect
	* Promise 对象
	* Iterator
	* Generator
	* 异步操作和Async函数
	* Class
	* Decorator
	* Module
	* 二进制数组
	* SIMD
	* 工具

