# 获取图片验证码

### 服务对应方法名
##### serviceName
 `com.ly.fn.bx.rpc.service.AlbAcountSafeService`
##### functionCode
 `getImgCode`

##### 接口请求返回示例
返回示例：
```json
{
    "code": "0000",
    "message": "成功",
    "data": {
        "imgCode": "IAYUD",
        "serialNo": "IG5A2A426C001FU4F52C"
    }
}
```
##### 请求参数说明
无

##### 返回参数说明
节点 | 父节点 | 节点描述 | 取值说明
---|---|---|---
imgCode | data | 验证码 | 
serialNo | data | 验证码流水号 | 