# token 获取会员信息

### 服务对应方法名
##### functionCode
 `getValue`

##### 接口请求返回示例
返回示例：
```json
{
    "code": "0000",
    "message": "成功",
    "data": {
        "acount": "13771854930",
        "isChild": "0",
        "memberId": "100004",
        "cMerberId": "2345243"
    }
}
```
```json
{
    "code": "1001",
    "message": "密码过期",
    "data": null
}
```
```json
{
    "code": "1000",
    "message": "其他错误---",
    "data": null
}
```
##### 请求参数说明
节点 | 节点描述 | 取值说明
---|---|---
token | token | '45b2bee9-ed85-46fc-bc46-cfd1c6c09f9e'

##### 返回参数说明
节点 | 父节点 | 节点描述 | 取值说明
---|---|---|---
acount | data | 账号 | 手机号
isChild | data | 是否子账户 | 0: 主帐号  1: 子帐号
memberId | data | 主账户memberId |
cMerberId | data | 子账户memberId |