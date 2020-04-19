### ab测试组件
```javascript
        window.T_ABConfig = {
            version: [
                {
                    url: "index.html"
                },{
                    url: "index1.html"
                }
            ],
            bts: function(index){return index <=100;},
            el: "#J_GotoVersion"
        };
```
