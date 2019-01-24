# let and const
ES5只有两种声明变量的方法：`var`命令和`function`命令。
ES6一共有6种声明变量的方法：`let`、`const`、`import`、`class`

# destructuring
圆括号问题：不能使用和能使用 `没明白`
* 用途
    * 交换变量的值
    * 从函数返回多个值
    * 函数参数的定义
    * 提取JSON数据
    * 函数参数的默认值
    * 遍历Map结构
    * 输入模块的指定方法

# string
javascript6种方法表示一个字符
```javascript
// chrome 56.0.2924.87   不支持

let hello = 123;
hell\u{6F} // 123

at()

padStart()、padEnd() ES2017引入
```

```javascript
'\z' === 'z'  // true
'\172' === 'z' // true
'\x7A' === 'z' // true
'\u007A' === 'z' // true
'\u{7A}' === 'z' // true
```

# regex
字符串对象的4个方法：`match()`、`replace()`、`search()`、`split()`

# number
* 二进制和八进制表示法 （前缀：0b | 0B  、  0o | 0O）
* `isFinite()`、`isNaN()`（Number中使用只对数值有效）、`parseInt()`、`parseFloat()`,将这些方法移入Number中，减少全局性方法
* `Number.isInteger()`（判断一个值是否为整数）
* Math新增17个与数学相关的方法
    * Math.trunc() 去除小数部分
    * Math.sign() 判断正负或零
    * Math.cbrt() 立方根
    * Math.clz32()
    * Math.imul()
    * Math.fround() 单精度浮点数形式
    * Math.hypot() 返回所有参数的平方和的平方根
    * 对数方法
        * Math.expm1() => Math.expm1(x)返回ex - 1，即Math.exp(x) - 1
        * Math.log1p() => Math.log1p(x)方法返回1 + x的自然对数，即Math.log(1 + x)
        * Math.log10() => Math.log10(x)返回以10为底的x的对数
        * Math.log2() => Math.log2(x)返回以2为底的x的对数
    * 三角函数方法
        * Math.sinh(x) 返回x的双曲正弦（hyperbolic sine）
        * Math.cosh(x) 返回x的双曲余弦（hyperbolic cosine）
        * Math.tanh(x) 返回x的双曲正切（hyperbolic tangent）
        * Math.asinh(x) 返回x的反双曲正弦（inverse hyperbolic sine）
        * Math.acosh(x) 返回x的反双曲余弦（inverse hyperbolic cosine）
        * Math.atanh(x) 返回x的反双曲正切（inverse hyperbolic tangent）
    * Math.signbit() 判断一个值的正负 （Chrome不支持）
指数运算符： 2**2 === Math.pow(2,2)

# array


# function
* 箭头函数使用注意点：
    * 函数体内的`this`对象，就是定义时所在的对象，而不是使用时所在的对象。
    * 不可以当作构造函数，也就是说，不可以使用`new`命令，否则会抛出一个错误。
    * 不可以使用`arguments`对象，该对象在函数体内不存在。如果要用，可以用Rest参数代替。
    * 不可以使用`yield`命令，因此箭头函数不能用作Generator函数。


# object