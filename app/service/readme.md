## 用户信息

#### com.ly.fn.bx.rpc.service.AlbLoginService
- 登录 checkLogin

#### com.ly.fn.bx.rpc.service.AlbTokenService
- token获取会员信息 getValue

#### com.ly.fn.bx.rpc.service.AlbAcountSafeService
- 获取图片验证码 getImgCode
验证账号 validateAcount
重置登录密码 resetLoginPassword
获取会员是否设置交易密码 qryPayPwd
设置交易密码 setPayPwd
重置交易密码 resetPayPwd

#### com.ly.fn.bx.rpc.service.AlbSmsCodeService
获取短信验证码 sendSmsCode

#### com.ly.fn.bx.rpc.service.AlbHolderService
常用投保人 getHolderList


## 产品信息
#### com.ly.fn.bx.rpc.service.AlbProductEncapsulateService
产品分类 getAlbInsuranceTypeList
产品列表 getProductList
产品详情 getAlbProductDetail


## 优惠信息
#### com.ly.fn.bx.rpc.service.AlbRedPacketService
- 获取可用红包 getUsableRedPacket
- 获取订单已绑定红包 bindRedPacket


## 订单信息
com.ly.fn.bx.rpc.service.AlbOrderEncapsulateService
订单初始化 getOrderInitDataNew
订单列表 orderList
订单详情 orderDetail
获取企业投保人信息 getEnterpriseInfo
取消订单 cancelOrder
撤销前弹框展示 refundOrderPre
撤单 refundOrder
重投 reDeliver
下单 addOrderNew


## 支付信息
#### com.ly.fn.bx.rpc.service.AlbPayEncapsulateService
支付初始化 toInitPay
获取支付连接 getMobilePayUrl
现金账户支付 balancePay
授权账户支付 creditPay
支付成功 paySucceed


## 其他信息
#### com.ly.fn.bx.rpc.service.AlbOcrService
ocr识别 recogniseCard

#### com.ly.fn.bx.rpc.service.AlbCommonService
获取机场信息 getAlbAirportInfo


#### com.ly.fn.bx.rpc.service. AlbLoginService
是否显示图片验证码（普通登录） isShowImg