#Base 使用
```
var Class1 = Base.extend({
    initialize: function(config){
        //init super
        Class1.superclass.initialize.apply(this,arguments);
        //init
        this.init(config)
    },
    init: function(config){
        alert(config);
        this.a = 1;
        this.b = 2;
    }
})
var class1 = new Class1(1);
class1.init() // alert(1);
```
所有类必须要实例化话才能使用
```
var Class2 = Class1.extend({
    initialize: function(){
        Class2.superclass.initialize.apply(this,arguments);
    },
    b: 3,
    doAlert: function(){
        alert(this.a); // alert(1);
        alert(this.b) // alert(3);
    }
})
```
Class2继承了Class1 拥有了a、b属性
```
class2.get("b")  // return 3;
class2.set("b",4)
class2.get("b") //return 4;
class2.set("c") //return false 因为不存在该属性
```
```
class2.on("event1",function(e){
    alert(1);
})
class2.trigger("event1") // alert(1); trigger方法也可以换成fire
class2.once("event2",function(){ //只绑定1次事件
    alert(1);
})
```
```
class2.before("doAlert",function(){
    alert("before");
})
class2.after("doAlert",function(){
    alert("after");
})
class2.before("doAlert",function(){
    alert("before2") //所有的aspect层都走的事件机制所以并不会覆盖上一个before方法 如果需要使before实效 执行class2.off("doAlert:before")
})
class2.off("doAlert:before") //去除before方法
```
