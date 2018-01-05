<template>
<div class="order" v-if="initData">
    <div class="top">
        <div class="tit">{{initData.title}}</div>
        <div class="txt">{{initData.dec}}</div>
    </div>
    <section>
        <div v-if="insureList && item['isShowInsure']" v-for="(item, index) in insureList" :key="index">
            <div class="picker-line">
                <div class="picker-row" @click="item['isShowPicker'] = (item['isShowArrow'] ? true : false)">
                    <div class="picker-name">{{item['name']}}</div>
                    <div class="picker-val">{{item['dec']}}</div>
                    <div class="arrow arrow-right" v-if="item['isShowArrow']"></div>
                </div>
                <popup-picker
                    :open="item['isShowPicker']"
                    :pickers="item['pickers']"
                    :pickerIndex="index"
                    :pickerType="'insure'"
                    :placeholder="'请选择' + item['name']"
                    @on-close="item['isShowPicker'] = false"
                    @on-change="confirmPickerHandler"
                />
            </div>
            <div class="rowLine" v-if="insureList.length !== index + 1"></div>
        </div>
    </section>
    <section>
        <!-- 起保时间 start -->
        <div class="picker-line">
            <div class="picker-row" @click="startTime['showPicker'] = (startTime['isShow'] ? true : false); startTime['errMsg'] = ''">
                <div class="picker-name picker-time"><i class="time-icon"></i><span>起保时间</span></div>
                <div class="picker-val" v-if="startTime['value']">{{startTime['value']}}</div>
                <div class="picker-val picker-choose" v-else>请选择</div>
                <div class="arrow arrow-right" v-if="startTime['isShow']"></div>
            </div>
            <div class="picker-time-tip" v-if="startTime['str']">{{startTime['str']}}</div>
            <div class="errMsg" :class="{ hidden: !startTime['errMsg'] }"><i class="warn">!</i><span>{{startTime['errMsg']}}</span></div>
            <datetime-picker
                format="yyyy-MM-dd"
                :open="startTime['showPicker']"
                :value="startTime['default']"
                :min="startTime['start']"
                :max="startTime['end']"
                :pickerIndex="-1"
                :pickerType="'starttime'"
                @on-close="cancelPickerHandler"
                @on-change="confirmPickerHandler"
            />
        </div>
        <!-- 起保时间 end -->
        <!-- 旅行团号 -->
        <template v-if="tourGroup['isShow']">
            <div class="rowLine"></div>
            <div class="picker-line">
                <div class="picker-row picker-order">
                    <div class="picker-name">旅行团号</div>
                    <input class="picker-val" type="text" v-model.trim="tourGroup['value']" placeholder="请输入旅行团号，非必填">
                </div>
                <div class="errMsg" :class="{ hidden: !tourGroup['errMsg'] }"><i class="warn">!</i><span>asdgsd</span></div>
            </div>
        </template>
        <!-- 航班号 -->
        <template v-if="flight['isShow']">
            <div class="rowLine"></div>
            <div class="picker-line">
                <div class="picker-row picker-order">
                    <div class="picker-name">航班号</div>
                    <input class="picker-val" type="text" v-model.trim="flight['value']" @focus="flight['errMsg'] = ''" @blur="getInputVal(-1, 'flight')" placeholder="请输入航班号">
                </div>
                <div class="errMsg" :class="{ hidden: !flight['errMsg'] }"><i class="warn">!</i><span>{{flight['errMsg']}}</span></div>
            </div>
        </template>
        <!-- 出发机场 -->
        <template v-if="startAirport['isShow']">
            <div class="rowLine"></div>
            <div class="picker-line">
                <div class="picker-row picker-order" @click="startAirport['showPopup'] = true; startAirport['errMsg'] = ''">
                    <div class="picker-name">出发机场</div>
                    <div class="picker-val" v-if="startAirport['value']">{{startAirport['value']}}</div>
                    <div class="picker-val picker-choose" v-else>请选择出发机场</div>
                    <div class="arrow arrow-right"></div>
                </div>
                <div class="errMsg" :class="{ hidden: !startAirport['errMsg'] }"><i class="warn">!</i><span>{{startAirport['errMsg']}}</span></div>
                <popup direction="right" :full="true" :open="startAirport['showPopup']" @on-close="cancelPopupHandler('startAirport')">
                    <search :value="searchValue" :showHeader="false" placeholder="请输入（如上海虹桥机场）" @input="inputSearchHandler" @on-change="inputSearchHandler"></search>
                    <index-list v-if="airports && airports.length > 0">
                        <index-section v-for="(item, index) in airports" :key="index" :index="item.initial">
                            <cell v-for="(_item, _index) in item.cells" :key="_index" :title="_item" :cellType="'startAirport'" :arrow="false" @click="clickHandler">
                                <div slot="title">{{_item['name']}}</div>
                            </cell>
                        </index-section>
                    </index-list>
                    <div class="nothing" v-else>
                        <div class="img"></div>
                        <div class="tip">非常抱歉！没有符合查询条件的机场~</div>
                    </div>
                </popup>
            </div>
        </template>
        <!-- 到达机场 -->
        <template v-if="arriveAirport['isShow']">
            <div class="rowLine"></div>
            <div class="picker-line">
                <div class="picker-row picker-order" @click="arriveAirport['showPopup'] = true; arriveAirport['errMsg'] = ''">
                    <div class="picker-name">到达机场</div>
                    <div class="picker-val" v-if="arriveAirport['value']">{{arriveAirport['value']}}</div>
                    <div class="picker-val picker-choose" v-else>请选择到达机场</div>
                    <div class="arrow arrow-right"></div>
                </div>
                <div class="errMsg" :class="{ hidden: !arriveAirport['errMsg'] }"><i class="warn">!</i><span>{{arriveAirport['errMsg']}}</span></div>
                <popup direction="right" :full="true" :open="arriveAirport['showPopup']" @on-close="cancelPopupHandler('arriveAirport')">
                    <search :value="searchValue" :showHeader="false" placeholder="请输入（如上海虹桥机场）" @input="inputSearchHandler" @on-change="inputSearchHandler"></search>
                    <index-list v-if="airports && airports.length > 0">
                        <index-section v-for="(item, index) in airports" :key="index" :index="item.initial">
                            <cell v-for="(_item, _index) in item.cells" :key="_index" :title="_item" :cellType="'arriveAirport'" :arrow="false" @click="clickHandler">
                                <div slot="title">{{_item['name']}}</div>
                            </cell>
                        </index-section>
                    </index-list>
                    <div class="nothing" v-else>
                        <div class="img"></div>
                        <div class="tip">非常抱歉！没有符合查询条件的机场~</div>
                    </div>
                </popup>
            </div>
        </template>
    </section>
    <!-- 企业投保 -->
    <section v-if="holder['type'] === 'enterprise'">
        <div class="picker-line">
            <div class="picker-row picker-title" :class="{ 'show': holder.isShow }" @click="holder['isShow'] = !holder.isShow">
                <div class="picker-name"><i class="holder-icon"></i><span>企业投保</span></div>
                <div class="picker-val">
                    <div v-if="!holder.isShow && !holder.enterprise.name">请完善信息</div>
                    <div v-if="!holder.isShow && holder.enterprise.name" class="txt">{{holder.enterprise.name}}</div>
                    <div></div>
                </div>
                <div class="arrow" :class="{ 'arrow-hide': !holder['isShow'], 'arrow-show': holder['isShow'] }"></div>
            </div>
        </div>
        <template v-if="holder['isShow']">
            <div class="rowLine"></div>
            <div class="picker-info">
                <div class="picker-line">
                    <div class="picker-row">
                        <div class="picker-name">企业名称</div>
                        <input class="picker-val" type="text" v-model.trim="holder.enterprise.name" @focus="holder.enterprise.nameErrMsg = ''" @blur="getInputVal(-2, 'name')" placeholder="请输入企业名称">
                    </div>
                    <div class="errMsg" :class="{ hidden: !holder.enterprise.nameErrMsg }"><i class="warn">!</i><span>{{holder.enterprise.nameErrMsg}}</span></div>
                </div>
                <div class="picker-line">
                    <div class="rowLine"></div>
                    <div class="picker-row"  @click="holder.enterprise.cardTypeErrMsg = '';holder.enterprise.cardType['isShowPicker'] = (holder.enterprise.cardType.isShowArrow ? true : false)">
                        <div class="picker-name">企业证件类型</div>
                        <div class="picker-val" v-if="holder.enterprise.cardType.dec">{{holder.enterprise.cardType.dec}}</div>
                        <div class="picker-val picker-choose" v-else>请选择企业证件类型</div>
                        <div class="arrow arrow-right" v-if="holder.enterprise.cardType.isShowArrow"></div>
                    </div>
                    <div class="errMsg" :class="{ hidden: !holder.enterprise.cardTypeErrMsg }"><i class="warn">!</i><span>{{holder.enterprise.cardTypeErrMsg}}</span></div>
                    <popup-picker
                        :open="holder.enterprise.cardType['isShowPicker']"
                        :pickers="holder.enterprise.cardType['pickers']"
                        :pickerIndex="-2"
                        :pickerType="'cardType'"
                        :placeholder="'请选择证件类型'"
                        @on-close="holder.enterprise.cardType['isShowPicker'] = false"
                        @on-change="confirmPickerHandler"
                    />
                </div>
                <div class="picker-line">
                    <div class="rowLine"></div>
                    <div class="picker-row">
                        <div class="picker-name">企业证件号码</div>
                        <input class="picker-val" type="text" v-model.trim="holder.enterprise.cardNo" @focus="holder.enterprise.cardNoErrMsg = ''" @blur="getInputVal(-2, 'cardNo')" placeholder="请输入企业证件号码">
                    </div>
                    <div class="errMsg" :class="{ hidden: !holder.enterprise.cardNoErrMsg }"><i class="warn">!</i><span>{{holder.enterprise.cardNoErrMsg}}</span></div>
                </div>
                <div class="picker-line">
                    <div class="rowLine"></div>
                    <div class="picker-row">
                        <div class="picker-name">手机号码</div>
                        <input class="picker-val" type="text" v-model.trim="holder.enterprise.phone" @focus="holder.enterprise.phoneErrMsg = ''" @blur="getInputVal(-2, 'phone')" placeholder="请输入手机号码">
                    </div>
                    <div class="errMsg" :class="{ hidden: !holder.enterprise.phoneErrMsg }"><i class="warn">!</i><span>{{holder.enterprise.phoneErrMsg}}</span></div>
                </div>
                <div class="picker-line">
                    <div class="rowLine"></div>
                    <div class="picker-row">
                        <div class="picker-name">电子邮箱</div>
                        <input class="picker-val" type="text" v-model.trim="holder.enterprise.email" @focus="holder.enterprise.emailErrMsg = ''" @blur="getInputVal(-2, 'email')" placeholder="请输入电子邮箱">
                    </div>
                    <div class="errMsg" :class="{ hidden: !holder.enterprise.emailErrMsg }"><i class="warn">!</i><span>{{holder.enterprise.emailErrMsg}}</span></div>
                </div>
            </div>
        </template>
    </section>
    <!-- 指定投保人 -->
    <section v-if="holder['type'] === 'appoint'">
        <div class="picker-line">
            <div class="picker-row picker-title" :class="{ 'show': holder.isShow }" @click="holder['isShow'] = !holder.isShow">
                <div class="picker-name"><i class="holder-icon"></i><span>投保人</span></div>
                <div class="picker-val">
                    <div class="policy" v-if="holders && holder['isShow']">
                        <span v-for="(item, index) in holders" :key="index" :class="{ curr: item['isShow'] }" @click.stop="appointHandler(index)">{{item['holderName']}}</span>
                    </div>
                    <div v-if="!holder.isShow && !holder.person.name">请完善信息</div>
                    <div v-if="!holder.isShow && holder.person.name" class="txt">{{holder.person.name}}</div>
                    <div></div>
                    <i class="photo-icon" @click="getOCR(-1)"></i>
                    <input style="display: none;" ref="ocrHolderImg" @change="getFile(-1)" type="file" accept="image/*" />
                </div>
                <div class="arrow" :class="{ 'arrow-hide': !holder['isShow'], 'arrow-show': holder['isShow'] }"></div>
            </div>
        </div>
        <template v-if="holder['isShow']">
            <div class="rowLine"></div>
            <div class="picker-info">
                <div class="picker-line">
                    <div class="picker-row">
                        <div class="picker-name">投保人姓名</div>
                        <input class="picker-val" type="text" v-model.trim="holder.person.name" @focus="holder.person.nameErrMsg = ''" @blur="getInputVal(-3, 'name')" placeholder="请输入投保人姓名">
                    </div>
                    <div class="errMsg" :class="{ hidden: !holder.person.nameErrMsg }"><i class="warn">!</i><span>{{holder.person.nameErrMsg}}</span></div>
                </div>
                <div class="picker-line" v-if="holder.person.cardTypeShow">
                    <div class="rowLine"></div>
                    <div class="picker-row" @click="holder.person.cardTypeErrMsg = '';holder.person.cardType['isShowPicker'] = (holder.person.cardType.isShowArrow ? true : false)">
                        <div class="picker-name">证件类型</div>
                        <div class="picker-val" v-if="holder.person.cardType.dec">{{holder.person.cardType.dec}}</div>
                        <div class="picker-val picker-choose" v-else>请选择证件类型</div>
                        <div class="arrow arrow-right" v-if="holder.person.cardType.isShowArrow"></div>
                    </div>
                    <div class="errMsg" :class="{ hidden: !holder.person.cardTypeErrMsg }"><i class="warn">!</i><span>{{holder.person.cardTypeErrMsg}}</span></div>
                    <popup-picker
                        :open="holder.person.cardType['isShowPicker']"
                        :pickers="holder.person.cardType['pickers']"
                        :pickerIndex="-3"
                        :pickerType="'cardType'"
                        :placeholder="'请选择证件类型'"
                        @on-close="holder.person.cardType['isShowPicker'] = false"
                        @on-change="confirmPickerHandler"
                    />
                </div>
                <div class="picker-line">
                    <div class="rowLine"></div>
                    <div class="picker-row">
                        <div class="picker-name">证件号码</div>
                        <input class="picker-val" type="text" v-model.trim="holder.person.cardNo" @focus="holder.person.cardNoErrMsg = ''" @blur="getInputVal(-3, 'cardNo')" placeholder="请输入证件号码">
                    </div>
                    <div class="errMsg" :class="{ hidden: !holder.person.cardNoErrMsg }"><i class="warn">!</i><span>{{holder.person.cardNoErrMsg}}</span></div>
                </div>
                <template v-if="holder.person.cardType.dec !== '身份证'">
                    <div class="picker-line">
                        <div class="rowLine"></div>
                        <div class="picker-row" @click="holder.person['birthdayShowPicker'] = true; holder.person.birthdayErrMsg = ''">
                            <div class="picker-name">出生日期</div>
                            <div class="picker-val" v-if="holder.person.birthday">{{holder.person.birthday}}</div>
                            <div class="picker-val picker-choose" v-else>请选择出生日期</div>
                            <div class="arrow arrow-right"></div>
                        </div>
                        <div class="errMsg" :class="{ hidden: !holder.person.birthdayErrMsg }"><i class="warn">!</i><span>{{holder.person.birthdayErrMsg}}</span></div>
                        <datetime-picker
                            format="yyyy-MM-dd"
                            :open="holder.person['birthdayShowPicker']"
                            :value="holder.person['defaultBirthday']"
                            :max="holder.person['birthdayEnd']"
                            :pickerIndex="-3"
                            :pickerType="'birthday'"
                            @on-close="cancelPickerHandler"
                            @on-change="confirmPickerHandler"
                        />
                    </div>
                    <div class="picker-line" v-if="holder.person.genderShow">
                        <div class="rowLine"></div>
                        <div class="picker-row"  @click="holder.person.genderErrMsg = '';holder.person.gender['isShowPicker'] = (holder.person.gender.isShowArrow ? true : false)">
                            <div class="picker-name">性别</div>
                            <div class="picker-val" v-if="holder.person.gender.dec">{{holder.person.gender.dec}}</div>
                            <div class="picker-val picker-choose" v-else>请选择性别</div>
                            <div class="arrow arrow-right" v-if="holder.person.gender.isShowArrow"></div>
                        </div>
                        <div class="errMsg" :class="{ hidden: !holder.person.genderErrMsg }"><i class="warn">!</i><span>{{holder.person.genderErrMsg}}</span></div>
                        <popup-picker
                            :open="holder.person.gender['isShowPicker']"
                            :pickers="holder.person.gender['pickers']"
                            :pickerIndex="-3"
                            :pickerType="'gender'"
                            :placeholder="'请选择性别'"
                            @on-close="holder.person.gender['isShowPicker'] = false"
                            @on-change="confirmPickerHandler"
                        />
                    </div>
                </template>
                <div class="picker-line">
                    <div class="rowLine"></div>
                    <div class="picker-row">
                        <div class="picker-name">手机号码</div>
                        <input class="picker-val" type="text" v-model.trim="holder.person.phone" @focus="holder.person.phoneErrMsg = ''" @blur="getInputVal(-3, 'phone')" placeholder="请输入手机号码">
                    </div>
                    <div class="errMsg" :class="{ hidden: !holder.person.phoneErrMsg }"><i class="warn">!</i><span>{{holder.person.phoneErrMsg}}</span></div>
                </div>
                <div class="picker-line">
                    <div class="rowLine"></div>
                    <div class="picker-row">
                        <div class="picker-name">电子邮箱</div>
                        <input class="picker-val" type="text" v-model.trim="holder.person.email" @focus="holder.person.emailErrMsg = ''" @blur="getInputVal(-3, 'email')" placeholder="请输入电子邮箱">
                    </div>
                    <div class="errMsg" :class="{ hidden: !holder.person.emailErrMsg }"><i class="warn">!</i><span>{{holder.person.emailErrMsg}}</span></div>
                </div>
            </div>
        </template>
    </section>
    <section class="ocr" v-if="ocrShow && insurantNum > 1">
        <div class="picker-line">
            <div class="picker-row">
                <div class="picker-name">智能识别被保人</div>
                <div class="picker-val">
                    <span @click="getOCRs('idCard')">批量识别身份证</span>
                    <span @click="getOCRs('passport')">批量识别护照</span>
                </div>
                <input style="display: none;" ref="ocrIdCard" @change="getFiles('idCard')" type="file" accept="image/*" multiple="multiple" />
                <input style="display: none;" ref="ocrPassport" @change="getFiles('passport')" type="file" accept="image/*" multiple="multiple" />
            </div>
        </div>
        <div class="rowLine"></div>
        <div class="picker-info">
            <div class="picker-line" @click="isShowOcr = true">
                <div class="picker-row txt">
                    一次最多识别5张照片，<span>如何提高效率？</span>
                </div>
            </div>
        </div>
        <popup direction="top" :full="true" :open="isShowOcr" @on-close="isShowOcr = false">
            <div class="ocr-popup">
                <div class="title">示例图片</div>
                <div class="txt">
                    <p>1、拍照要清晰，避免模糊图且覆盖信息页（去背景、无遮挡、无反光、无水印）</p>
                    <p>2、尽量保证文字横向排列</p>
                    <p>3、图像文字尽量在同一水平线上</p>
                    <p>4、临时身份证无法识别出用户信息</p>
                </div>
                <div class="tit">身份证识别案例</div>
                <div class="txt">
                    <img src="../../../images/documents/ocr1.png" alt="">
                </div>
                <div class="tit">护照识别案例</div>
                <div class="txt">
                    <img src="../../../images/documents/ocr2.png" alt="">
                </div>
                <div class="icon" @click="isShowOcr = false"><icon>&#xe641;</icon></div>
            </div>
        </popup>
    </section>
    <!-- 被保人 -->
    <section v-if="insurants && insurants[0]" v-for="(item, index) in insurants" :key="index">
        <div class="picker-line">
            <div class="picker-row picker-title" :class="{ 'show': item.isShow }" @click="item['isShow'] = !item.isShow">
                <div class="picker-name"><i :class="{ 'insured-off': item['isShow'], 'insured-on': !item['isShow'] }"></i><span>被保人{{insurants.length > 1 ? index + 1 : ''}}</span></div>
                <div class="picker-val">
                    <div v-if="!item.isShow && !item.name">请完善信息</div>
                    <div v-if="!item.isShow && item.name" class="txt">{{item.name}}</div>
                    <div></div>
                    <i class="photo-icon" @click="getOCR(index)"></i>
                    <input style="display: none;" ref="ocrImg" @change="getFile(index)" type="file" accept="image/*" />
                </div>
                <div class="arrow" :class="{ 'arrow-hide': !item['isShow'], 'arrow-show': item['isShow'] }"></div>
            </div>
        </div>
        <template v-if="item['isShow']">
            <div class="rowLine"></div>
            <div class="picker-info">
                <div class="picker-line" v-if="item.relationShow">
                    <div class="rowLine"></div>
                    <div class="picker-row" @click="item.relationErrMsg = '';item.relation['isShowPicker'] = (item.relation.isShowArrow ? true : false)">
                        <div class="picker-name">您是被保人的</div>
                        <div class="picker-val" v-if="item.relation.dec">{{item.relation.dec}}</div>
                        <div class="picker-val picker-choose" v-else>投保人是被保人的谁</div>
                        <div class="arrow arrow-right" v-if="item.relation.isShowArrow"></div>
                    </div>
                    <div class="errMsg" :class="{ hidden: !item.relationErrMsg }"><i class="warn">!</i><span>{{item.relationErrMsg}}</span></div>
                    <popup-picker
                        :open="item.relation['isShowPicker']"
                        :pickers="item.relation['pickers']"
                        :pickerIndex="index"
                        :pickerType="'relation'"
                        :placeholder="'投保人是被保人的谁'"
                        @on-close="item.relation['isShowPicker'] = false"
                        @on-change="confirmPickerHandler"
                    />
                </div>
                <div class="rowLine"></div>
                <div class="picker-line">
                    <div class="picker-row">
                        <div class="picker-name">被保人姓名</div>
                        <input class="picker-val" type="text" v-model.trim="item.name" @focus="item.nameErrMsg = ''" @blur="getInputVal(index, 'name')" placeholder="请输入被保人姓名">
                    </div>
                    <div class="errMsg" :class="{ hidden: !item.nameErrMsg }"><i class="warn">!</i><span>{{item.nameErrMsg}}</span></div>
                </div>
                <div class="picker-line" v-if="item.cardTypeShow">
                    <div class="rowLine"></div>
                    <div class="picker-row" @click="item.cardTypeErrMsg = '';item.cardType['isShowPicker'] = (item.cardType.isShowArrow ? true : false)">
                        <div class="picker-name">证件类型</div>
                        <div class="picker-val" v-if="item.cardType.dec">{{item.cardType.dec}}</div>
                        <div class="picker-val picker-choose" v-else>请选择证件类型</div>
                        <div class="arrow arrow-right" v-if="item.cardType.isShowArrow"></div>
                    </div>
                    <div class="errMsg" :class="{ hidden: !item.cardTypeErrMsg }"><i class="warn">!</i><span>{{item.cardTypeErrMsg}}</span></div>
                    <popup-picker
                        :open="item.cardType['isShowPicker']"
                        :pickers="item.cardType['pickers']"
                        :pickerIndex="index"
                        :pickerType="'cardType'"
                        :placeholder="'请选择证件类型'"
                        @on-close="item.cardType['isShowPicker'] = false"
                        @on-change="confirmPickerHandler"
                    />
                </div>
                <div class="picker-line">
                    <div class="rowLine"></div>
                    <div class="picker-row">
                        <div class="picker-name">证件号码</div>
                        <input class="picker-val" type="text" v-model.trim="item.cardNo" @focus="item.cardNoErrMsg = ''" @blur="getInputVal(index, 'cardNo')" placeholder="请输入证件号码">
                    </div>
                    <div class="errMsg" :class="{ hidden: !item.cardNoErrMsg }"><i class="warn">!</i><span>{{item.cardNoErrMsg}}</span></div>
                </div>
                <template v-if="item.cardType.dec !== '身份证'">
                    <div class="picker-line">
                        <div class="rowLine"></div>
                        <div class="picker-row" @click="item['birthdayShowPicker'] = true; item.birthdayErrMsg = ''">
                            <div class="picker-name">出生日期</div>
                            <div class="picker-val" v-if="item.birthday">{{item.birthday}}</div>
                            <div class="picker-val picker-choose" v-else>请选择出生日期</div>
                            <div class="arrow arrow-right"></div>
                        </div>
                        <div class="errMsg" :class="{ hidden: !item.birthdayErrMsg }"><i class="warn">!</i><span>{{item.birthdayErrMsg}}</span></div>
                        <datetime-picker
                            format="yyyy-MM-dd"
                            :open="item['birthdayShowPicker']"
                            :value="item['defaultBirthday']"
                            :min="DATA.birthday['start']"
                            :max="DATA.birthday['end']"
                            :pickerIndex="index"
                            :pickerType="'birthday'"
                            @on-close="cancelPickerHandler"
                            @on-change="confirmPickerHandler"
                        />
                    </div>
                    <div class="picker-line" v-if="item.genderShow">
                        <div class="rowLine"></div>
                        <div class="picker-row" @click="item.genderErrMsg = '';item.gender['isShowPicker'] = (item.gender.isShowArrow ? true : false)">
                            <div class="picker-name">性别</div>
                            <div class="picker-val" v-if="item.gender.dec">{{item.gender.dec}}</div>
                            <div class="picker-val picker-choose" v-else>请选择性别</div>
                            <div class="arrow arrow-right" v-if="item.gender.isShowArrow"></div>
                        </div>
                        <div class="errMsg" :class="{ hidden: !item.genderErrMsg }"><i class="warn">!</i><span>{{item.genderErrMsg}}</span></div>
                        <popup-picker
                            :open="item.gender['isShowPicker']"
                            :pickers="item.gender['pickers']"
                            :pickerIndex="index"
                            :pickerType="'gender'"
                            :placeholder="'请选择证件类型'"
                            @on-close="item.gender['isShowPicker'] = false"
                            @on-change="confirmPickerHandler"
                        />
                    </div>
                </template>
                <div class="picker-line">
                    <div class="rowLine"></div>
                    <div class="picker-row">
                        <div class="picker-name">保费</div>
                        <div class="picker-val">&yen;{{item.price}}</div>
                    </div>
                </div>
                <div class="picker-line" v-if="insurants.length !== insurantMin">
                    <div class="rowLine"></div>
                    <div class="picker-row" @click="deleteHandler(index)">
                        <div class="picker-operation">
                            <i class="delete-icon"></i><span>删除被保险人</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </section>
    <!-- 新增被保险人 -->
    <section v-if="insurantNum > 1 && insurants.length <= insurantNum">
        <div class="picker-line">
            <div class="picker-row" @click="addHandler">
                <div class="picker-operation">
                    <i :class="{ 'add-icon': insurants.length < insurantNum, 'add-gray-icon': insurants.length >= insurantNum }"></i><span>新增被保险人</span>
                </div>
            </div>
        </div>
    </section>
    <!-- 受益人信息 -->
    <section>
        <div class="picker-line">
            <div class="picker-row picker-title">
                <div class="picker-name"><i class="beneficiary-icon"></i><span>受益人信息</span></div>
                <div class="picker-val"></div>
            </div>
        </div>
        <div class="picker-info">
            <div class="rowLine"></div>
            <div class="picker-line">
                <div class="picker-row">
                    <div class="picker-name">受益人类型</div>
                    <div class="picker-val">法定受益人</div>
                </div>
            </div>
        </div>
    </section>
    <!-- 折扣信息 -->
    <section v-if="discountPrice">
        <div class="picker-line">
            <div class="picker-row">
                <div class="picker-name">优惠金额</div>
                <div class="picker-val picker-left">-&yen;{{discountPrice}}</div>
            </div>
        </div>
    </section>
    <!-- 客户告知书 -->
    <div class="agreement">
        <div class="check"><i :class="{ curr: isAgreement }" @click="changeAgreement"></i></div>
        <div class="info">已阅读并了解<span class="link" @click="linkHandler('clause')">保险条款</span>、<span class="link" @click="linkHandler('instruction')">保险须知</span>、<span class="link" @click="linkHandler('inform')">客户告知书</span>。<span class="gra">此产品销售服务方为：天圆地方（北京）保险代理有限公司</span></div>
    </div>
    <!--  -->
    <order-bottom :content="'立即投保'" :showOrderBottom="true" :totalFee="totalFee" :actualPayFee="actualPayFee" @on-insure="insureHandler"></order-bottom>
    <!-- alert -->
    <alert :open="alertShow" :confirmText="'知道了'" @on-confirm="alertShow = false">{{alertText}}</alert>
    <!-- confirm -->
    <confirm :open="confirmShow" @on-close="confirmShow = false" @on-confirm="confirmHandler">{{confirmText}}</confirm>
    <!-- 确认页 -->
    <popup class="sure" direction="right" :full="true" :open="isShowSure" @on-close="cancelSureHandler">
        <div class="content" v-if="submitDATA">
            <div class="top">
                <div class="tit">{{initData.title}}</div>
                <div class="txt">{{initData.dec}}</div>
            </div>
            <dl v-if="submitDATA.base">
                <dt class="tit">
                    <div>基本信息</div>
                </dt>
                <dd>
                    <div class="list">
                        <div class="name">保障期限：</div>
                        <div>{{submitDATA.base.startTimeStr}}</div>
                    </div>
                    <div class="list" v-if="submitDATA.base.tourGroup">
                        <div class="name">旅行团号：</div>
                        <div>{{submitDATA.base.tourGroup}}</div>
                    </div>
                    <div class="list" v-if="submitDATA.base.flight">
                        <div class="name">航班号：</div>
                        <div>{{submitDATA.base.flight}}</div>
                    </div>
                    <div class="list" v-if="submitDATA.base.startAirport">
                        <div class="name">出发机场：</div>
                        <div>{{submitDATA.base.startAirportName}}</div>
                    </div>
                    <div class="list" v-if="submitDATA.base.arriveAirport">
                        <div class="name">到达机场：</div>
                        <div>{{submitDATA.base.arriveAirportName}}</div>
                    </div>
                    <div class="list">
                        <div class="name">投保份数：</div>
                        <div>{{submitDATA.base.qty}}</div>
                    </div>
                    <div class="list">
                        <div class="name">总保费：</div>
                        <div>&yen;{{submitDATA.base.totalFee}}</div>
                    </div>
                    <div class="list" v-if="submitDATA.base.discountPrice">
                        <div class="name">优惠金额：</div>
                        <div>-&yen;{{submitDATA.base.discountPrice}}</div>
                    </div>
                </dd>
            </dl>
            <template v-if="submitDATA.holder">
                <dl v-if="submitDATA.holder.type === 'enterprise'">
                    <dt class="tit yellow">
                        <div>企业投保人信息</div>
                    </dt>
                    <dd v-if="submitDATA.holder.enterprise">
                        <div class="list">
                            <div class="name">企业投保人姓名：</div>
                            <div>{{submitDATA.holder.enterprise.name}}</div>
                        </div>
                        <div class="list">
                            <div class="name">企业证件类型：</div>
                            <div>{{submitDATA.holder.enterprise.cardTypeDec}}</div>
                        </div>
                        <div class="list">
                            <div class="name">企业证件号：</div>
                            <div>{{submitDATA.holder.enterprise.cardNo}}</div>
                        </div>
                        <div class="list">
                            <div class="name">企业手机号码：</div>
                            <div>{{submitDATA.holder.enterprise.phone}}</div>
                        </div>
                        <div class="list">
                            <div class="name">企业电子邮箱：</div>
                            <div>{{submitDATA.holder.enterprise.email}}</div>
                        </div>
                    </dd>
                </dl>
                <dl v-else>
                    <dt class="tit yellow">
                        <div>投保人信息</div>
                    </dt>
                    <dd v-if="submitDATA.holder.person">
                        <div class="list">
                            <div class="name">投保人姓名：</div>
                            <div>{{submitDATA.holder.person.name}}</div>
                        </div>
                        <div class="list" v-if="submitDATA.holder.person.cardTypeDec">
                            <div class="name">证件类型：</div>
                            <div>{{submitDATA.holder.person.cardTypeDec}}</div>
                        </div>
                        <div class="list">
                            <div class="name">证件号：</div>
                            <div>{{submitDATA.holder.person.cardNo}}</div>
                        </div>
                        <template v-if="submitDATA.holder.person.cardTypeDec !== '身份证'">
                            <div class="list">
                                <div class="name">出生日期：</div>
                                <div>{{submitDATA.holder.person.birthday}}</div>
                            </div>
                            <div class="list" v-if="submitDATA.holder.person.genderDec">
                                <div class="name">性别：</div>
                                <div>{{submitDATA.holder.person.genderDec}}</div>
                            </div>
                        </template>
                        <div class="list">
                            <div class="name">手机号码：</div>
                            <div>{{submitDATA.holder.person.phone}}</div>
                        </div>
                        <div class="list" v-if="submitDATA.holder.person.email">
                            <div class="name">电子邮箱：</div>
                            <div>{{submitDATA.holder.person.email}}</div>
                        </div>
                    </dd>
                </dl>
            </template>
            <dl v-if="submitDATA.insurants" v-for="(item, index) in submitDATA.insurants" :key="index">
                <dt class="tit">
                    <div>被保人信息{{submitDATA.insurants.length > 1 ? index + 1 : ''}}</div>
                </dt>
                <dd>
                    <div class="list" v-if="item['relationDec']">
                        <div class="name">您是被保人的谁：</div>
                        <div>{{item['relationDec']}}</div>
                    </div>
                    <div class="list">
                        <div class="name">被保人姓名：</div>
                        <div>{{item['name']}}</div>
                    </div>
                    <div class="list" v-if="item['cardTypeDec']">
                        <div class="name">证件类型：</div>
                        <div>{{item['cardTypeDec']}}</div>
                    </div>
                    <div class="list">
                        <div class="name">证件号：</div>
                        <div>{{item['cardNo']}}</div>
                    </div>
                    <template v-if="item['cardTypeDec'] !== '身份证'">
                        <div class="list">
                            <div class="name">出生日期：</div>
                            <div>{{item['birthday']}}</div>
                        </div>
                        <div class="list" v-if="item['genderDec']">
                            <div class="name">性别：</div>
                            <div>{{item['genderDec']}}</div>
                        </div>
                    </template>
                    <div class="list">
                        <div class="name">保费：</div>
                        <div>&yen;{{item['price']}}</div>
                    </div>
                </dd>
            </dl>
            <dl>
                <dt class="tit yellow">
                    <div>受益人信息</div>
                </dt>
                <dd>
                    <div class="list">
                        <div class="name">受益人类型</div>
                        <div>法定受益人</div>
                    </div>
                </dd>
            </dl>
            <!-- 客户告知书 -->
            <div class="agreement">
                <div class="check"><i :class="{ curr: true }"></i></div>
                <div class="info">已阅读并了解<span class="link" @click="linkHandler('clause')">保险条款</span>、<span class="link" @click="linkHandler('instruction')">保险须知</span>、<span class="link" @click="linkHandler('inform')">客户告知书</span>。<span class="gra">此产品销售服务方为：天圆地方（北京）保险代理有限公司</span></div>
            </div>
        </div>
        <order-bottom :content="'提交订单'" :showOrderBottom="true" :totalFee="totalFee" :actualPayFee="actualPayFee" @on-insure="submitHandler"></order-bottom>
    </popup>
</div>
</template>

<style lang="less">
@import '../../../styles/mint-common.less';
@import './style.less';
</style>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Alert, Confirm, Popup, PopupPicker, DatetimePicker, Search, OrderBottom, IndexList, IndexSection, Cell, Icon } from '@/components'
import { clone, dateRange, idCardInfo, timeTypes, getPrice, setSessionStore, getSessionStore, getLocalStore, getImg } from '@/utils'
import { identityCardValidate, userNameValidate, enterpriseNameValidate, phoneValidate, emailValidate, flightValidate, isAndroid } from '@/utils/validate'
import { platid, refId } from '@/utils/config'
import * as order from '@/services/order'
import * as other from '@/services/other'
import * as user from '@/services/user'

export default {
    components: {
        OrderBottom,
        Alert,
        Confirm,
        Popup,
        PopupPicker,
        DatetimePicker,
        Search,
        IndexList,
        IndexSection,
        Cell,
        Icon
    },
    data() {
        return {
            pickerVisible: '',
            insureList: [], // 投保类型和投保方式
            insure: {
                type: 1, // 1: 个人投保 0: 指定投保人 2: 企业投保
                method: 0, // 0: 一单一人 1: 一单多人
            },
            initData: null,
            afreshData: null, // 重投数据
            isShow: true,
            alertShow: false,
            alertText: '',
            confirmShow: false,
            confirmText: '',
            mtDateIndex: 0, // -1 起保时间 -2 投保人 0,1,2... 被保人
            // ----------------------------------------------
            // 起保时间
            startTime: {
                isShow: true, // 是否可以筛选
                value: '',
                default: '',
                showPicker: false,
                str: '',
                temp: '',
                start: '',
                startTime: '',
                end: '',
                endTime: '',
                errMsg: '',
            },
            // 旅行团号
            tourGroup: {
                value: '',
                errMsg: '',
                isShow: true,
            },
            // 航班号
            flight: {
                value: '',
                errMsg: '',
                isShow: false,
            },
            // 出发机场
            startAirport: {
                showPopup: false,
                value: '',
                code: '',
                errMsg: '',
                isShow: false,
            },
            // 到达机场
            arriveAirport: {
                showPopup: false,
                value: '',
                code: '',
                errMsg: '',
                isShow: false,
            },
            airports: [],
            searchValue: '',
            // ----------------------------------------------
            DATA: {
                businessType: null,
                businessRelation: null,
                holderCardType: null,
                holderGender: null,
                insurantRelation: null,
                insurantCardType: null,
                insurantGender: null,
                // 初始化出生日期
                birthday: {
                    default: '',
                    start: '',
                    startTime: '',
                    end: '',
                    endTime: '',
                },
                insurant: {
                    isShow: true,
                    relation: '',
                    relationShow: false,
                    relationErrMsg: '',
                    name: '',
                    nameErrMsg: '',
                    cardType: '',
                    cardTypeShow: false,
                    cardTypeErrMsg: '',
                    cardNo: '',
                    cardNoErrMsg: '',
                    birthday: '',
                    defaultBirthday: '',
                    birthdayShowPicker: false,
                    birthdayErrMsg: '',
                    gender: '',
                    genderShow: false,
                    genderErrMsg: '',
                    price: 0,
                }
            },
            holders: null, // 常用投保人
            // 投保人信息
            holder: {
                isShow: true,
                type: 'person',
                // 个人投保/指定投保人
                person: {
                    name: '',
                    nameErrMsg: '',
                    cardType: '',
                    cardTypeShow: false,
                    cardTypeErrMsg: '',
                    cardNo: '',
                    cardNoErrMsg: '',
                    birthday: '',
                    defaultBirthday: '',
                    birthdayEnd: '',
                    birthdayEndTime: '',
                    birthdayShowPicker: false,
                    birthdayErrMsg: '',
                    gender: '',
                    genderType: '',
                    genderShow: false,
                    genderErrMsg: '',
                    phone: '',
                    phoneErrMsg: '',
                    email: '',
                    emailErrMsg: '',
                },
                // 企业投保
                enterprise: {
                    name: '',
                    nameErrMsg: '',
                    cardType: '',
                    cardTypeErrMsg: '',
                    cardNo: '',
                    cardNoErrMsg: '',
                    phone: '',
                    phoneErrMsg: '',
                    email: '',
                    emailErrMsg: '',
                }
            },
            isShowOcr: false,
            ocrShow: !isAndroid(),
            // 被保人信息
            insurants: [],
            insurantNum: 0, // 被保人总数
            insurantMin: 0, // 最少数
            deleteIndex: 0,
            priceFactors: null,
            // ----------------------------------------------
            // ----------------------------------------------
            // ----------------------------------------------
            // ----------------------------------------------
            totalFee: 0, // 总价
            actualPayFee: 0, // 折后价
            discountPrice: 0, // 折扣
            isAgreement: false, // 是否已阅读
            submitDATA: null, // 提交数据
            isClick: true, // 防止连续点击
            isShowSure: false, // 是否到确认页
        }
    },
    beforeMount() {
        document.title = '订单填写'
    },
    computed: {
        ...mapState({
            types: state => state.order.insureTypes,
            methods: state => state.order.insureMethods,
        }),
    },
    created() {},
    mounted() {
        this.init();
    },
    methods: {
        // ...mapActions([ 'getInit' ]),
        // ------------------
        // 初始化信息 start
        // ------------------

        async init() {
            const detailData = getSessionStore('detailData');
            const { productCode, safeguardPlanCode, isEnterprise = false, isSingle = false, isMass = false } = detailData;
            const res = await order.init({ productCode, safeguardPlanCode });
            const { code, data } = res;
            if(code === '0000'){
                this.initData = data;
                this.insurantNum = data.restricPersonNum;
                this.insurantMin = data.restricPersonNum ? 1 : 0;
                this.afreshData = await this.initAfresh();
                this.initStartTime();
            }else if(code === '1001'){
                location.href = '/login';
            }
            this.initShowFields({ isEnterprise, isSingle, isMass });
        },

        // 重投
        async initAfresh() {
            const { orderCode = '' } = this.$route.query;
            if(!orderCode) return null;
            const res = await order.afresh({ orderCode });
            const { code, data } = res;
            if(code === '0000'){
                this.isAgreement = true;
                return data;
            }else if(code === '1001'){
                location.href = '/login';
            }else{
                return null;
            }
        },

        // 初始化显示字段
        async initShowFields({ isEnterprise, isSingle, isMass }) {
            const { flightCode = false, showAirPort = false } = this.initData;
            // 航班号
            this.flight['isShow'] = flightCode;
            // 机场
            this.startAirport['isShow'] = !!showAirPort;
            this.arriveAirport['isShow'] = !!showAirPort;
            !!showAirPort && this.getAirport();

            // ----------------------------------
            // 初始化选择list
            {
                const { businessTypeList, businessRelationList, holderCardTypeList, holderGenderList, insurantRelationList, insurantCardTypeList, insurantGenderList } = this.initData;
                let businessType = null, businessRelation = null, holderCardType = null, holderGender = null, insurantRelation = null, insurantCardType = null, insurantGender = null;
                function arrFn(arr, type) {
                    let isShowArrow = true;
                    let dec = '';
                    let code = '';
                    let activeIndex = 0;
                    arr.map((item, index) => {
                        item['value'] = index.toString();
                        item['label'] = item['paramDesc'];
                        if((type === 'relation' || type === 'bRelation') && item['paramDesc'] == '其他'){
                            activeIndex = index;
                            dec = item['paramDesc'];
                            code = item['paramCode'];
                        }
                        if(type === 'bType' && item['paramDesc'] == '统一社会信用代码证'){
                            activeIndex = index;
                            dec = item['paramDesc'];
                            code = item['paramCode'];
                        }
                        if(type === 'cardType' && item['paramDesc'] == '身份证'){
                            activeIndex = index;
                            dec = item['paramDesc'];
                            code = item['paramCode'];
                        }
                        return item;
                    });

                    return {
                        activeIndex,
                        dec,
                        code,
                        isShowArrow,
                        isShowPicker: false,
                        arr,
                        pickers: [{ value: activeIndex.toString(), options: arr }]
                    };
                }
                if(businessTypeList && businessTypeList[0]){
                    let arr = businessTypeList;
                    businessType = arrFn(arr, 'bType');
                }
                if(businessRelationList && businessRelationList[0]){
                    let arr = businessRelationList;
                    businessRelation = arrFn(arr, 'bRelation');
                }
                if(holderCardTypeList && holderCardTypeList[0]){
                    let arr = holderCardTypeList;
                    holderCardType = arrFn(arr, 'cardType');
                }
                if(holderGenderList && holderGenderList[0]){
                    let arr = holderGenderList;
                    holderGender = arrFn(arr);
                }
                if(insurantRelationList && insurantRelationList[0]){
                    let arr = insurantRelationList;
                    insurantRelation = arrFn(arr, 'relation');
                }
                if(insurantCardTypeList && insurantCardTypeList[0]){
                    let arr = insurantCardTypeList;
                    insurantCardType = arrFn(arr, 'cardType');
                }
                if(insurantGenderList && insurantGenderList[0]){
                    let arr = insurantGenderList;
                    insurantGender = arrFn(arr);
                }
                this.DATA.businessType = businessType;
                this.DATA.businessRelation = businessRelation;
                this.DATA.holderCardType = holderCardType;
                this.DATA.holderGender = holderGender;
                this.DATA.insurantRelation = insurantRelation;
                this.DATA.insurantCardType = insurantCardType;
                this.DATA.insurantGender = insurantGender;
            }

            // ----------------------------------
            // 投保人
            {
                // 指定投保人
                {
                    const { holderCardType: cardTypeShow, holderGender: genderShow } = this.initData;
                    const { holderCardType, holderGender } = this.DATA;
                    const { person } = this.holder;
                    person.cardTypeShow = cardTypeShow;
                    person.cardType = holderCardType ? clone(holderCardType) : null;
                    person.genderShow = genderShow;
                    person.gender = holderGender ? clone(holderGender) : null;
                    let endTime = new Date().subtract('years', 18);
                    person.birthdayEnd = endTime.format('yyyy-MM-dd');
                    person.birthdayEndTime = endTime;
                    person.defaultBirthday = endTime.format('yyyy-MM-dd');
                }
                // 企业投保
                {
                    const { businessType } = this.DATA;
                    this.holder.enterprise.cardType = clone(businessType);
                }
            }

            // 初始化被保人出身日期范围/priceFactors
            {
                const detailData = getSessionStore('detailData');
                const { minAge, minAgeUnit, maxAge, maxAgeUnit } = detailData;
                let priceFactors = [];
                const { birthday } = this.DATA;

                const { startDate, endDate } = dateRange(minAgeUnit, minAge, maxAgeUnit, maxAge);
                birthday.start = startDate;
                birthday.startTime = new Date(startDate.replace(/-/g, '/'));
                birthday.end = endDate;
                birthday.endTime = new Date(endDate.replace(/-/g, '/'));
                birthday.default = endDate;
                detailData.priceFactors.map((item, index) => {
                    if (item['factorCode'] === 'insuredBirthday') {
                        // let { lowerLimitValue: minAge, lowerLimitValueUnit: minUnit, upperLimitValue: maxAge, upperLimitValueUnit: maxUnit } = item;

                    }else{
                        priceFactors.push(item);
                    }
                });
                this.priceFactors = priceFactors;
            }

            // 被保人
            {
                const { insurantRelation: relationShow, insurantCardType: cardTypeShow, insurantGender: genderShow, restricPersonNum = 0 } = this.initData;
                const { insurantRelation, insurantCardType, insurantGender, insurant, birthday } = this.DATA;
                insurant.relationShow = relationShow;
                insurant.relation = insurantRelation ? clone(insurantRelation): null;
                insurant.cardTypeShow = cardTypeShow;
                insurant.cardType = insurantCardType ? clone(insurantCardType): null;
                insurant.genderShow = genderShow;
                insurant.gender = insurantGender ? clone(insurantGender): null;
                insurant.defaultBirthday = birthday.default;
                insurant.birthdayStart = birthday.start;
                insurant.birthdayEnd = birthday.end;

                if(restricPersonNum > 0){
                    this.insurants.push(clone(insurant));
                }
            }

            this.initAfreshFields({ isEnterprise, isSingle, isMass });
        },

        // 重投信息加载
        async initAfreshFields({ isEnterprise, isSingle, isMass }) {
            if(this.afreshData){
                const { holderDefault, isGroup, flightCode, tourGroupCode, startAirport, startAirportName, arriveAirport, arriveAirportName } = this.afreshData;
                this.insure = { type: holderDefault, method: isGroup };
                this.tourGroup.value = tourGroupCode;
                this.flight.value = flightCode;
                this.startAirport.value = startAirportName;
                this.startAirport.code = startAirport;
                this.arriveAirport.value = arriveAirportName;
                this.arriveAirport.code = arriveAirport;

                const { holderName, holderCredType, holderCredNo, holderBirthday, holderPhone, holderEmail } = this.afreshData;
                let obj = {
                    holderName,
                    holderCredType,
                    holderCredNo,
                    holderBirthday,
                    holderPhone,
                    holderEmail
                }

                if(this.insure.type == 0){
                    this.holder.type = 'appoint';
                    this.holders = await this.getHolders();
                    this.appointHandler(-2, obj);
                }else if(this.insure.type == 2){
                    this.holder.type = 'enterprise';
                    // let info = await this.getEnterprise();
                    this.enterpriseHandler(-2, obj);
                }

                const { albReDeliverInsurantVOS } = this.afreshData;
                const { insurant } = this.DATA;
                let insurants = [];
                albReDeliverInsurantVOS.map((item, index) => {
                    let obj = clone(insurant);
                    obj = this.afreshInsurantHandler(item, obj);
                    insurants.push(obj);
                });
                this.insurants = insurants;
                this.updateChoose();
            }

            let insureList = this.initInsureList({ isEnterprise, isSingle, isMass });
            this.insureList = insureList;
        },

        // 获取机场信息
        async getAirport(name = '') {
            const res = await other.airport({ name });
            const { code, data } = res;
            if(code === '0000'){
                this.airports = data;
            }else if(code === '1001'){
                location.href = '/login';
            }else{
                this.airports = [];
            }
        },

        // 获取常用投保人信息
        async getHolders() {
            // if(this.holders && this.holders.length > 0) return this.holders;
            const res = await user.holders();
            const { code, data } = res;
            if(code === '0000'){
                return data;
            }else if(code === '1001'){
                location.href = '/login';
            }else{
                return null;
            }
        },

        // 获取企业投保人信息
        async getEnterprise() {
            const detailData = getSessionStore('detailData');
            const { productCode } = detailData;
            const res = await order.enterprise({ productCode });
            const { code, data } = res;
            if(code === '0000'){
                return data;
            }else if(code === '1001'){
                location.href = '/login';
            }else{
                return null;
            }
        },

        // 投保设置信息
        initInsureList({ isEnterprise, isSingle, isMass }){
            let types = [], methods = [];
            let typeIndex = 0, methodIndex = 0;
            this.types.map((item, index) => {
                if(item['type'] === 'enterprise'){
                    if(isEnterprise){
                        types.push(item);
                    }
                }else{
                    types.push(item)
                }
            });
            types.map((item, index) => {
                if(item['index'] == this.insure.type){
                    typeIndex = index;
                }
            });
            this.methods.map((item, index) => {
                if(item['type'] === 'single'){
                    if(isSingle){
                        methods.push(item);
                    }
                }else if(item['type'] === 'mass'){
                    if(isMass){
                        methods.push(item);
                    }
                }
            });
            methods.map((item, index) => {
                if(item['index'] == this.insure.method){
                    methodIndex = index;
                }
            });
            let list = [
                { arr: types, type: 'type', name: '投保类型' },
                { arr: methods, type: 'method', name: '投保方式' }
            ];
            let insureList = [];

            list.map((item, index) => {
                let activeIndex = 0;
                if(index == 0){
                    activeIndex = typeIndex;
                }else{
                    activeIndex = methodIndex;
                }
                let currentIndex = insureList.length;
                let insureArr = item['arr'];
                let name = item['name'];
                let dec = insureArr[activeIndex] ? insureArr[activeIndex].name : '';
                let isShowInsure = true;
                let isShowArrow = true;
                let isShowPicker = false;

                if(insureArr.length === 0){
                    isShowInsure = false;
                }

                if(insureArr.length === 1){
                    isShowArrow = false;
                }

                insureArr.map((item, index) => {
                    item['value'] = index.toString();
                    item['label'] = `${item['name']}${item['dec'] ? '<span>(' + item['dec'] + ')</span>' : ''}`;
                    return item;
                });
                let pickers = [{ value: '0', options: insureArr }];

                let insureItem = {
                    activeIndex,
                    index: currentIndex,
                    type: item['type'],
                    name,
                    dec,
                    insureArr,
                    pickers,
                    isShowInsure,
                    isShowArrow,
                    isShowPicker
                }

                insureList.push(insureItem);
            });

            return insureList;
        },

        // 初始化起保时间
        initStartTime() {
            let { delayDays = 0, endInsuranceTime = 0, fixedBeginTimeLimit = 0 } = this.initData;
            delayDays = parseInt(delayDays || 0)
            endInsuranceTime = parseInt(endInsuranceTime || 0)
            let startTime, endTime

            startTime = new Date().add('days', delayDays)
            endTime = new Date().add('days', endInsuranceTime)

            this.startTime['startTime'] = startTime;
            this.startTime['start'] = startTime.format('yyyy-MM-dd')
            this.startTime['default'] = startTime.format('yyyy-MM-dd')
            this.startTime['endTime'] = endTime;
            this.startTime['end'] = endTime.format('yyyy-MM-dd')

            if(fixedBeginTimeLimit == 1){
                this.startTime['isShow'] = false; // 不可选择时间
                this.startTimeChange();
            }
        },

        // ocr 识别证件信息
        getOCR(index) {
            if(index === -1){
                this.$refs.ocrHolderImg.click();
            }else{
                this.$refs.ocrImg[index].click();
            }
        },

        async getFile(index) {
            this.$indicator.open('识别中...');
            let file;
            if(index === -1){
                file = this.$refs.ocrHolderImg;
            }else{
                file = this.$refs.ocrImg[index];
            }
            let imgList = await getImg(file);
            if(!imgList || !imgList[0]) return false;
            const res = await other.ocr({ photoContent: imgList[0] });
            const { code, data } = res;
            this.$indicator.close();
            if(code === '0000'){
                this.getOcrInfo(index, data);
                this.updateChoose();
            }else if(code === '1001'){
                location.href = '/login';
            }else{
                this.$toast('识别失败，请重新上传身份证或护照')
            }
            if(index === -1){
                this.$refs.ocrHolderImg.value = '';
            }else{
                this.$refs.ocrImg[index].value = '';
            }
        },

        getOCRs(type) {
            if(type === 'idCard'){
                this.$refs.ocrIdCard.click();
            }else if(type === 'passport'){
                this.$refs.ocrPassport.click();
            }
        },

        async getFiles(type) {
            this.$indicator.open('识别中...');
            let file;
            if(type === 'idCard'){
                file = this.$refs.ocrIdCard;
            }else if(type === 'passport'){
                file = this.$refs.ocrPassport;
            }
            let imgList = await getImg(file, true);
            if(!imgList || !imgList[0]) return false;
            if(type === 'idCard'){
                this.$refs.ocrIdCard.value = '';
            }else if(type === 'passport'){
                this.$refs.ocrPassport.value = '';
            }
            if(imgList.length > 5){
                this.$indicator.close();
                this.$toast('一次最多识别5张照片');
                // this.$toast({ message: '一次最多识别5张照片', duration: 1000000 });
                return false;
            }
            const { initIns, flag } = this.getOcrValidate();
            if(!flag){
                this.$indicator.close();
                this.alertShow = true;
                this.alertText = `被保人人数已经满了，不可再添加了`;
                return false;
            }
            let res;
            if(type === 'idCard'){
                res = await other.ocrIdCard({ photos: imgList });
            }else if(type === 'passport'){
                res = await other.ocrPassport({ photos: imgList });
            }
            this.$indicator.close();
            this.getOcrInfos(res, initIns);
        },

        getOcrValidate() {
            const insurants = this.insurants;
            let initIns = -1, flag = true;
            for(let i = 0; i < insurants.length; i++){
                const { name, cardNo, birthday } = insurants[i];
                if(!(name || cardNo || birthday)){
                    if(i < this.insurantMin){
                        initIns = i;
                    }else{
                        insurants.splice(i, 1);
                    }
                }
            }
            if(insurants.length >= this.insurantNum){
                flag = false;
            }
            if(initIns === -1){
                initIns = insurants.length;
            }
            return { initIns, flag };
        },

        getOcrInfos(data, initIns) {
            const { insurant } = this.DATA;
            let list = [], sNum = 0, fNum = 0, addNum = initIns >= this.insurants.length ? this.insurantNum - this.insurants.length : this.insurantNum - initIns;
            data = data || [];
            data.map((item, index) => {
                if(item['falg']){
                    sNum++;
                    list.push(item);
                }else{
                    fNum++;
                }
            })
            if(list.length > addNum){
                this.alertShow = true;
                this.alertText = `本产品被保人只支持${this.insurantNum}人，识别出的人数超过了被保人人数，只能添加 ${addNum}个`;
            }else{
                if(sNum === data.length){
                    this.$toast('识别成功');
                }else{
                    this.alertShow = true;
                    this.alertText = `${sNum}张识别成功，${fNum}张识别失败,请重新上传清晰的身份证/护照照片`;
                }
            }
            
            list.map((item, index) => {
                if(index < addNum){
                    if(initIns > this.insurantMin - 1){
                        this.insurants.push(clone(insurant));
                    }
                    this.getOcrInfo(initIns, item);
                    initIns++;
                }
            })
            this.updateChoose();
        },

        // 处理数据
        getOcrInfo(index, info) {
            const { name, cardType, cardNo, birthday, gender } = info;
            if(index === -1){
                const { person } = this.holder;
                if(cardType && person.cardType){
                    person.cardType.arr.map((item, index) => {
                        if(item['paramCode'] == cardType){
                            person.cardType.activeIndex = index;
                            person.cardType.code = item['paramCode'];
                            person.cardType.dec = item['paramDesc'];
                            person.cardType.pickers[0].value = index.toString();
                        }
                    })
                }
                if(gender && person.gender){
                    person.gender.arr.map((item, index) => {
                        if(item['paramCode'] == gender){
                            person.gender.activeIndex = index;
                            person.gender.code = item['paramCode'];
                            person.gender.dec = item['paramDesc'];
                            person.gender.pickers[0].value = index.toString();
                        }
                    })
                }
                Object.assign(person, {
                    name,
                    cardNo,
                    birthday,
                    genderType: gender,
                })
                if(birthday){
                    Object.assign(person, {defaultBirthday: birthday})
                }
            }else{
                const insurant = this.insurants[index];
                if(cardType && insurant.cardTypeShow && insurant.cardType){
                    insurant.cardType.arr.map((item, index) => {
                        if(item['paramCode'] == cardType){
                            insurant.cardType.activeIndex = index;
                            insurant.cardType.code = item['paramCode'];
                            insurant.cardType.dec = item['paramDesc'];
                            insurant.cardType.pickers[0].value = index.toString();
                        }
                    })
                }
                if(gender && insurant.genderShow && insurant.gender){
                    insurant.gender.arr.map((item, index) => {
                        if(item['paramCode'] == gender){
                            insurant.gender.activeIndex = index;
                            insurant.gender.code = item['paramCode'];
                            insurant.gender.dec = item['paramDesc'];
                            insurant.gender.pickers[0].value = index.toString();
                        }
                    })
                }
                Object.assign(this.insurants[index], {
                    name,
                    cardNo,
                    birthday,
                })
                if(birthday){
                    Object.assign(this.insurants[index], {defaultBirthday: birthday})
                }
            }
        },

        // ------------------
        // 初始化信息 end
        // ------------------

        // ------------------------------------

        // ------------------
        // 选择信息 start
        // ------------------

        // 选择起保时间
        startTimeChange(selectDate) {
            const { fixedBeginTimeLimit = 0, delayDays = 0 } = this.initData;
            if(fixedBeginTimeLimit == 1){
                selectDate = new Date().add('days', delayDays).format('yyyy-MM-dd')
            }
            const detailData = getSessionStore('detailData');
            const { maxPeriod, maxPeriodUnit, minAge, minAgeUnit, maxAge, maxAgeUnit } = detailData;
            let startStr, endStr, startTemp, endTemp, selectTime;
            selectTime = new Date(selectDate.replace(/-/g, '/'));
            startStr = selectTime.format('yyyy年MM月dd日');
            startTemp = selectTime.format('yyyy-MM-dd');

            const { birthday } = this.DATA;
            const { startDate, endDate } = dateRange(minAgeUnit, minAge, maxAgeUnit, maxAge, selectDate);
            birthday.start = startDate;
            birthday.startTime = new Date(startDate.replace(/-/g, '/'));
            birthday.end = endDate;
            birthday.endTime = new Date(endDate.replace(/-/g, '/'));
            let def = birthday.default || endDate;
            def = new Date(def.replace(/-/g, '/')).getTime() < new Date(endDate.replace(/-/g, '/')).getTime() ? def : endDate;
            birthday.default = def;

            if(maxPeriodUnit == 'O'){
                endStr = '终身保障';
                endTemp = '终身保障';
            }else{
                let type = timeTypes[maxPeriodUnit.toUpperCase()];
                let elapseDay = selectTime.add(type, maxPeriod);
                let endTime = elapseDay.add('days', -1);
                endStr = endTime.format('yyyy年MM月dd日');
                endTemp = endTime.format('yyyy-MM-dd');
                endStr += '24时止'
            }

            this.startTime['str'] = `自${startStr}0时起至${endStr}`;
            this.startTime['temp'] = `${startTemp}~${endTemp}`;
            this.startTime['value'] = selectDate;
            this.startTime['default'] = selectDate;
            this.updateChoose();
        },

        // 显示/隐藏
        changeShow(index) {
            // 投保人
            if(index === -1){
                return false;
            }
        },

        // 切换指定投保人
        appointHandler(index, obj) {
            let _obj = null;
            if(index == -2){ // 重投
                _obj = obj;
                // const { holderName, holderCredType, holderCredNo, holderBirthday, holderGender, holderPhone, holderEmail } = obj;
            }else{
                if(!this.holders || this.holders.length <= 0) return false;
                let activeIndex = 0;
                this.holders.map((item, i) => {
                    item['isShow'] = false;
                    if(index == -1){
                        if(item['isDefault'] == 1){
                            item['isShow'] = true;
                            activeIndex = i;
                        }
                    }else{
                        if(i === index){
                            item['isShow'] = true;
                            activeIndex = i;
                        }
                    }
                    return item;
                });
                _obj = this.holders[activeIndex];
            }
            const { holderName, holderCredType, holderCredNo, holderBirthday, holderGender, holderPhone, holderEmail } = _obj;
            const { cardType, gender } = this.holder.person;
            if(holderCredType && cardType){
                cardType.arr.map((item, index) => {
                    if(item['paramCode'] == holderCredType){
                        cardType.activeIndex = index;
                        cardType.code = item['paramCode'];
                        cardType.dec = item['paramDesc'];
                        cardType.pickers[0].value = index.toString();
                    }
                })
            }
            if(holderGender && gender){
                gender.arr.map((item, index) => {
                    if(item['paramCode'] == holderGender){
                        gender.activeIndex = index;
                        gender.code = item['paramCode'];
                        gender.dec = item['paramDesc'];
                        gender.pickers[0].value = index.toString();
                    }
                })
            }
            Object.assign(this.holder.person, {
                name: holderName,
                cardNo: holderCredNo,
                birthday: holderBirthday,
                defaultBirthday: holderBirthday,
                genderType: holderGender,
                phone: holderPhone,
                email: holderEmail
            })
            this.holder.person.nameErrMsg = ''
            this.holder.person.cardTypeErrMsg = ''
            this.holder.person.cardNoErrMsg = ''
            this.holder.person.birthdayErrMsg = ''
            this.holder.person.genderErrMsg = ''
            this.holder.person.phoneErrMsg = ''
            this.holder.person.emailErrMsg = ''
            this.holder.enterprise.nameErrMsg = ''
            this.holder.enterprise.cardTypeErrMsg = ''
            this.holder.enterprise.cardNoErrMsg = ''
            this.holder.enterprise.phoneErrMsg = ''
            this.holder.enterprise.emailErrMsg = ''
        },

        // 个人
        personHandler(index) {
            const { relation, relationShow, cardType, cardTypeShow, gender, genderShow } = this.insurants[index];
            const { person } = this.holder;
            let insurant = this.insurants[index];
            relation.arr.map((item, index) => {
                if(item['paramDesc'] === '本人'){
                    relation.activeIndex = index;
                    relation.code = item['paramCode'];
                    relation.dec = item['paramDesc'];
                    relation.pickers[0].value = index.toString();
                }
            })
            if(person.cardTypeShow && cardTypeShow && cardType){
                person.cardType['code'] = cardType['code'];
                person.cardType['dec'] = cardType['dec'];
                person.cardType.pickers[0].value = cardType.pickers[0].value;
            }
            if(person.genderShow && genderShow && gender){
                person.gender['code'] = gender['code'];
                person.gender['dec'] = gender['dec'];
                person.gender.pickers[0].value = gender.pickers[0].value;
            }
            if(genderShow && gender){
                Object.assign(this.holder.person, { genderType: gender['code'] })
            }
            Object.assign(this.holder.person, {
                name: insurant.name,
                cardNo: insurant.cardNo,
                birthday: insurant.birthday,
                defaultBirthday: insurant.birthday,
                phone: getLocalStore('acount')
            });
            this.holder.person.nameErrMsg = ''
            this.holder.person.cardTypeErrMsg = ''
            this.holder.person.cardNoErrMsg = ''
            this.holder.person.birthdayErrMsg = ''
            this.holder.person.genderErrMsg = ''
            this.holder.person.phoneErrMsg = ''
            this.holder.person.emailErrMsg = ''
            this.holder.enterprise.nameErrMsg = ''
            this.holder.enterprise.cardTypeErrMsg = ''
            this.holder.enterprise.cardNoErrMsg = ''
            this.holder.enterprise.phoneErrMsg = ''
            this.holder.enterprise.emailErrMsg = ''
        },

        // 切换企业投保人
        enterpriseHandler(index, info) {
            let _obj = null;
            if(index == -2){
                const { holderName, holderCredType, holderCredNo, holderBirthday, holderGender, holderPhone, holderEmail } = info;
                _obj = {
                    enterpriseName: holderName,
                    enterpriseCredType: holderCredType,
                    enterpriseCredNo: holderCredNo,
                    enterprisePhone: holderPhone,
                    enterpriseEmail: holderEmail,
                }
            }else{
                _obj = info;
            }
            const { enterpriseName, enterpriseCredType, enterpriseCredNo, enterprisePhone, enterpriseEmail } = _obj;
            const { cardType } = this.holder.enterprise;
            if(enterpriseCredType && cardType){
                cardType.arr.map((item, index) => {
                    if(item['paramCode'] == enterpriseCredType){
                        cardType.activeIndex = index;
                        cardType.code = item['paramCode'];
                        cardType.dec = item['paramDesc'];
                        cardType.pickers[0].value = index.toString();
                    }
                })
            }
            Object.assign(this.holder.enterprise, {
                name: enterpriseName,
                cardNo: enterpriseCredNo,
                phone: enterprisePhone,
                email: enterpriseEmail
            })
            this.holder.person.nameErrMsg = ''
            this.holder.person.cardTypeErrMsg = ''
            this.holder.person.cardNoErrMsg = ''
            this.holder.person.birthdayErrMsg = ''
            this.holder.person.genderErrMsg = ''
            this.holder.person.phoneErrMsg = ''
            this.holder.person.emailErrMsg = ''
            this.holder.enterprise.nameErrMsg = ''
            this.holder.enterprise.cardTypeErrMsg = ''
            this.holder.enterprise.cardNoErrMsg = ''
            this.holder.enterprise.phoneErrMsg = ''
            this.holder.enterprise.emailErrMsg = ''
        },

        insurantHandler(index) {
            const { person } = this.holder;
            let { cardType, cardTypeShow, gender, genderShow } = this.insurants[index];
            if(person.cardTypeShow && cardTypeShow && cardType){
                cardType.arr.map((item, index) => {
                    if(item['paramCode'] == person.cardType.code){
                        cardType.activeIndex = index;
                        cardType.code = item['paramCode'];
                        cardType.dec = item['paramDesc'];
                        cardType.pickers[0].value = index.toString();
                    }
                })
            }
            if(genderShow && gender){
                gender.arr.map((item, index) => {
                    let code = person.genderShow ? person.gender.code : person.genderType;
                    if(item['paramCode'] == code){
                        gender.activeIndex = index;
                        gender.code = item['paramCode'];
                        gender.dec = item['paramDesc'];
                        gender.pickers[0].value = index.toString();
                    }
                })
            }
            Object.assign(this.insurants[index], {
                name: person.name,
                cardNo: person.cardNo,
                birthday: person.birthday,
                defaultBirthday: person.birthday,
            })
            this.insurants[index].nameErrMsg = ''
            this.insurants[index].cardTypeErrMsg = ''
            this.insurants[index].cardNoErrMsg = ''
            this.insurants[index].birthdayErrMsg = ''
            this.insurants[index].genderErrMsg = ''
            this.updateChoose();
        },

        // 重投信息
        afreshInsurantHandler(item, insurant) {
            let { relation, relationShow, cardType, cardTypeShow, gender, genderShow } = insurant;
            let { insurantRelation, insurantName, insurantCredType, insurantCredNo, insurantGender, insurantBirthday } = item;
            if(insurantRelation && relationShow && relation){
                relation.arr.map((_item, index) => {
                    if(_item['paramCode'] == insurantRelation){
                        relation.activeIndex = index;
                        relation.code = _item['paramCode'];
                        relation.dec = _item['paramDesc'];
                        relation.pickers[0].value = index.toString();
                    }
                })
            }
            if(insurantCredType && cardTypeShow && cardType){
                cardType.arr.map((_item, index) => {
                    if(_item['paramCode'] == insurantCredType){
                        cardType.activeIndex = index;
                        cardType.code = _item['paramCode'];
                        cardType.dec = _item['paramDesc'];
                        cardType.pickers[0].value = index.toString();
                    }
                })
            }
            if(insurantGender && genderShow && gender){
                gender.arr.map((_item, index) => {
                    if(_item['paramCode'] == insurantGender){
                        gender.activeIndex = index;
                        gender.code = _item['paramCode'];
                        gender.dec = _item['paramDesc'];
                        gender.pickers[0].value = index.toString();
                    }
                })
            }
            Object.assign(insurant, {
                name: insurantName,
                cardNo: insurantCredNo,
                birthday: insurantBirthday,
                defaultBirthday: insurantBirthday,
            });
            return insurant;
        },

        // picker 取消
        cancelPickerHandler(index, type) {
            if(type === 'insure'){
                let insureList = this.insureList;
                insureList[index].isShowPicker = false;
                return false;
            }

            if(index === -1){
                if(type === 'starttime') {
                    this.startTime['showPicker'] = false;
                    if(!this.startTime['value']){
                        this.startTime['errMsg'] = '请选择起保日期';
                    }
                    return false;
                }
            }

            if(index === -3){
                if(type === 'birthday'){
                    const { person } = this.holder;
                    person.birthdayShowPicker = false;
                    if(!person.birthday){
                        person.birthdayErrMsg = '请选择出生日期';
                    }
                    return false;
                }
            }

            // 被保人
            {

                if(type === 'birthday'){
                    this.insurants[index].birthdayShowPicker = false;
                    if(!this.insurants[index].birthday){
                        this.insurants[index].birthdayErrMsg = '请选择出生日期';
                    }
                    return false;
                }
            }

        },

        // picker 确定
        confirmPickerHandler(values, index, type) {
            const { insurant } = this.DATA;
            const { restricPersonNum } = this.initData;
            const detailData = getSessionStore('detailData');
            const { isGroupMinValue, isGroupMaxValue } = detailData;
            if(type === 'insure'){
                const { value = '0' } = values && values[0];
                let insureList = this.insureList;
                const { pickers, insureArr } = insureList[index];
                pickers[0]['value'] = value;
                insureList[index].dec = insureArr[value].name;
                insureList[index].isShowPicker = false;
                insureList[index].activeIndex = Number(value)
                if(insureList[index]['type'] === 'type'){
                    if(insureArr[value]['type'] == 'person'){
                        this.insure.type = 1;
                    }else if(insureArr[value]['type'] == 'appoint'){
                        this.insure.type = 0;
                    }else if(insureArr[value]['type'] == 'enterprise'){
                        this.insure.type = 2;
                    }
                    this.updateChoose('insureType', insureArr[value]['type']);
                }else{
                    let number = this.insurants.length;
                    if(insureArr[value]['type'] == 'single'){
                        this.insure.method = 0;
                        this.insurantMin = 1;
                        this.insurantNum = restricPersonNum;
                        if(number > restricPersonNum){
                            let num = number - restricPersonNum;
                            this.insurants.splice(restricPersonNum, num);
                        }
                    }else if(insureArr[value]['type'] == 'mass'){
                        this.insure.method = 1;
                        this.insurantMin = isGroupMinValue;
                        this.insurantNum = isGroupMaxValue;
                        if(number < isGroupMinValue){
                            let num = isGroupMinValue - number;
                            for(let i = 0; i < num; i++){
                                this.insurants.push(clone(insurant));
                            }
                        }
                        if(number > isGroupMaxValue){
                            let num = number - isGroupMinValue;
                            this.insurants.splice(isGroupMinValue, num);
                        }
                    }
                }
                return false;
            }

            if(index === -1){
                if(type === 'starttime'){
                    this.startTime['showPicker'] = false;
                    if(new Date(values.replace(/-/g, '/')).isBetween(this.startTime['start'], this.startTime['end'])){
                        this.startTimeChange(values);
                    }else{
                        this.startTime['value'] = values;
                        this.startTime['default'] = values;
                        this.startTime['errMsg'] = '起保时间不在承保范围内，请重新选择';
                    }
                }
                return false;
            }

            // 企业投保
            if(index === -2){
                if(type === 'cardType'){
                    const { value = '0' } = values && values[0];
                    const { cardType } = this.holder.enterprise;
                    const { pickers, arr } = cardType;
                    pickers[0]['value'] = value;
                    cardType.dec = arr[value].paramDesc;
                    cardType.code = arr[value].paramCode;
                    cardType.activeIndex = Number(value)
                    cardType.isShowPicker = false;
                    return false;
                }
            }

            // 指定投保人
            if(index === -3){
                if(type === 'cardType'){
                    const { value = '0' } = values && values[0];
                    const { cardType } = this.holder.person;
                    const { pickers, arr } = cardType;
                    pickers[0]['value'] = value;
                    cardType.dec = arr[value].paramDesc;
                    cardType.code = arr[value].paramCode;
                    cardType.activeIndex = Number(value)
                    cardType.isShowPicker = false;
                    if(cardType.dec === '身份证'){
                        const { person } = this.holder.person;
                        if(identityCardValidate(person.cardNo)){
                            let { birthday, gender } = idCardInfo(person.cardNo);
                            person.birthday = birthday;
                            person.defaultBirthday = birthday;
                            person.genderType = gender;
                            if(person.genderShow && person.gender){
                                person.gender.arr.map((item, index) => {
                                    if(item['paramCode'] == gender){
                                        person.gender.activeIndex = index;
                                        person.gender.code = item['paramCode'];
                                        person.gender.dec = item['paramDesc'];
                                        person.gender.pickers[0].value = index.toString();
                                    }
                                })
                            }
                            person.birthdayErrMsg = ''
                            person.genderErrMsg = ''
                        }
                    }
                    return false;
                }
                if(type === 'gender'){
                    const { value = '0' } = values && values[0];
                    const { gender } = this.holder.person;
                    const { pickers, arr } = gender;
                    pickers[0]['value'] = value;
                    gender.dec = arr[value].paramDesc;
                    gender.code = arr[value].paramCode;
                    gender.activeIndex = Number(value)
                    gender.isShowPicker = false;
                    return false;
                }
                if(type === 'birthday'){
                    const { person } = this.holder;
                    person.birthday = values;
                    person.defaultBirthday = values;
                    person.birthdayShowPicker = false;
                    if(new Date(values.replace(/-/g, '/')).age() < 18){
                        person.birthdayErrMsg = '投保人年龄不满18周岁不符合投保要求';
                    }
                    return false;
                }
            }

            // 被保人
            {
                console.log('被保人----');
                if(type === 'relation'){
                    const { value = '0' } = values && values[0];
                    const { relation } = this.insurants[index];
                    const { pickers, arr } = relation;
                    pickers[0]['value'] = value;
                    relation.dec = arr[value].paramDesc;
                    relation.code = arr[value].paramCode;
                    relation.activeIndex = Number(value)
                    relation.isShowPicker = false;
                    if(this.holder.type === 'appoint' && relation.dec === '本人'){
                        this.insurantHandler(index)
                    }
                    return false;
                }
                if(type === 'cardType'){
                    const { value = '0' } = values && values[0];
                    const { cardType } = this.insurants[index];
                    const { pickers, arr } = cardType;
                    pickers[0]['value'] = value;
                    cardType.dec = arr[value].paramDesc;
                    cardType.code = arr[value].paramCode;
                    cardType.activeIndex = Number(value)
                    cardType.isShowPicker = false;
                    if(cardType.dec === '身份证'){
                        let insurant = this.insurants[index];
                        if(identityCardValidate(insurant.cardNo)){
                            let { birthday, gender } = idCardInfo(insurant.cardNo);
                            insurant.birthday = birthday;
                            insurant.defaultBirthday = birthday;
                            insurant.genderType = gender;
                            if(insurant.genderShow && insurant.gender){
                                insurant.gender.arr.map((item, index) => {
                                    if(item['paramCode'] == gender){
                                        insurant.gender.activeIndex = index;
                                        insurant.gender.code = item['paramCode'];
                                        insurant.gender.dec = item['paramDesc'];
                                        insurant.gender.pickers[0].value = index.toString();
                                    }
                                })
                            }
                            insurant.birthdayErrMsg = ''
                            insurant.genderErrMsg = ''
                        }
                    }
                    return false;
                }
                if(type === 'gender'){
                    const { value = '0' } = values && values[0];
                    const { gender } = this.insurants[index];
                    const { pickers, arr } = gender;
                    pickers[0]['value'] = value;
                    gender.dec = arr[value].paramDesc;
                    gender.code = arr[value].paramCode;
                    gender.activeIndex = Number(value)
                    gender.isShowPicker = false;
                    return false;
                }
                if(type === 'birthday'){
                    this.insurants[index].birthday = values;
                    this.insurants[index].defaultBirthday = values;
                    this.insurants[index].birthdayShowPicker = false;
                    const { start, end } = this.DATA.birthday;
                    if(!new Date(values.replace(/-/g, '/')).isBetween(start, end)){
                        this.insurants[index].birthdayErrMsg = '被保人年龄不符合投保要求';
                    }else{
                        this.updateChoose();
                    }
                    return false;
                }
            }
        },

        // 关闭弹框
        cancelPopupHandler(type) {
            this[type]['showPopup'] = !this[type]['showPopup'];
            if(type === 'startAirport'){
                if(!this.startAirport['value']){
                    this.startAirport['errMsg'] = '请选择出发机场';
                }
            }

            if(type === 'arriveAirport'){
                if(!this.arriveAirport['value']){
                    this.arriveAirport['errMsg'] = '请选择到达机场';
                }
            }
        },

        // 机场搜索
        inputSearchHandler (value) {
            this.searchValue = value
            this.getAirport(value)
        },

        // 点击机场元素
        clickHandler(e, title, type) {
            this[type]['value'] = title.name;
            this[type]['code'] = title.code;
            this[type]['showPopup'] = !this[type]['showPopup'];
        },

        // 收集input框的数据
        getInputVal(index, type) {
            if(index === -1){
                if(type === 'flight'){
                    if(!this.flight['value']){
                        this.flight['errMsg'] = '请输入航班号';
                    }else if(!flightValidate(this.flight['value'])){
                        this.flight['errMsg'] = '请输入正确的航班号';
                    }
                }
                return false;
            }

            // 企业投保
            if(index === -2){
                const { enterprise } = this.holder;
                if(type === 'name'){
                    if(!enterprise.name){
                        enterprise.nameErrMsg = '请输入企业名称';
                    }else if(!enterpriseNameValidate(enterprise.name)){
                        enterprise.nameErrMsg = '企业名称不能少于4个字符';
                    }
                }
                if(type === 'cardNo'){
                    if(!enterprise.cardNo){
                        enterprise.cardNoErrMsg = '请输入企业证件号码';
                    }else if(enterprise.cardNo.length < 7){
                        enterprise.cardNoErrMsg = '企业证件号不能少于7个字符';
                    }
                }
                if(type === 'phone'){
                    if(!enterprise.phone){
                        enterprise.phoneErrMsg = '请输入手机号码';
                    }else if(!phoneValidate(enterprise.phone)){
                        enterprise.phoneErrMsg = '请输入正确的企业手机号码';
                    }
                }
                if(type === 'email'){
                    if(!enterprise.email){
                        enterprise.emailErrMsg = '请输入电子邮箱';
                    }else if(!emailValidate(enterprise.email)){
                        enterprise.emailErrMsg = '请输入正确的电子邮箱';
                    }
                }
                return false;
            }

            // 指定投保人
            if(index === -3){
                const { person } = this.holder;
                if(type === 'name'){
                    if(!person.name){
                        person.nameErrMsg = '请输入投保人姓名';
                    }else if(!userNameValidate(person.name)){
                        person.nameErrMsg = '姓名为汉字或英文字符（至少两个字符）';
                    }
                }
                if(type === 'cardNo'){
                    if(!person.cardNo){
                        person.cardNoErrMsg = '请输入证件号码';
                    }else if(!this.checkIDNumber(person.cardTypeShow ? person.cardType.code : -1, person.cardNo)){
                        person.cardNoErrMsg = '请填写正确的证件号码';
                    }
                    if(person.cardType && person.cardType.code == 1){
                        if(identityCardValidate(person.cardNo)){
                            let { birthday, gender } = idCardInfo(person.cardNo);
                            person.birthday = birthday;
                            person.defaultBirthday = birthday;
                            person.genderType = gender;
                            if(person.genderShow && person.gender){
                                person.gender.arr.map((item, index) => {
                                    if(item['paramCode'] == gender){
                                        person.gender.activeIndex = index;
                                        person.gender.code = item['paramCode'];
                                        person.gender.dec = item['paramDesc'];
                                        person.gender.pickers[0].value = index.toString();
                                    }
                                })
                            }
                            person.birthdayErrMsg = ''
                            person.genderErrMsg = ''
                        }
                    }
                }
                if(type === 'phone'){
                    if(!person.phone){
                        person.phoneErrMsg = '请输入手机号码';
                    }else if(!phoneValidate(person.phone)){
                        person.phoneErrMsg = '请输入正确的手机号码';
                    }
                }
                if(type === 'email'){
                    if(!person.email){
                        person.emailErrMsg = '请输入电子邮箱';
                    }else if(!emailValidate(person.email)){
                        person.emailErrMsg = '请输入正确的电子邮箱';
                    }
                }
                return false;
            }

            // 被保人
            {
                const insurant = this.insurants[index];
                if(type === 'name'){
                    if(!insurant.name){
                        insurant.nameErrMsg = '请输入被保人姓名';
                    }else if(!userNameValidate(insurant.name)){
                        insurant.nameErrMsg = '姓名为汉字或英文字符（至少两个字符）';
                    }
                }
                if(type === 'cardNo'){
                    if(!insurant.cardNo){
                        insurant.cardNoErrMsg = '请输入证件号码';
                    }else if(!this.checkIDNumber(insurant.cardTypeShow ? insurant.cardType.code : -1, insurant.cardNo)){
                        insurant.cardNoErrMsg = '请填写正确的证件号码';
                    }else{
                        const { type, person } = this.holder;
                        if(type === 'appoint'){
                            if(insurant.cardType.code == person.cardType.code && person.cardNo === insurant.cardNo){
                                insurant.cardNoErrMsg = '被保人的证件号码与投保人相同，关系应为本人';
                            }
                        }
                    }
                    if(insurant.cardType && insurant.cardType.code == 1){
                        if(identityCardValidate(insurant.cardNo)){
                            let { birthday, gender } = idCardInfo(insurant.cardNo);
                            insurant.birthday = birthday;
                            insurant.defaultBirthday = birthday;
                            if(insurant.genderShow && insurant.gender){
                                insurant.gender.arr.map((item, index) => {
                                    if(item['paramCode'] == gender){
                                        insurant.gender.activeIndex = index;
                                        insurant.gender.code = item['paramCode'];
                                        insurant.gender.dec = item['paramDesc'];
                                        insurant.gender.pickers[0].value = index.toString();
                                    }
                                })
                            }
                            insurant.birthdayErrMsg = '';
                            insurant.genderErrMsg = '';
                            this.updateChoose();
                        }
                    }
                }
            }
        },

        // 添加被保人
        addHandler() {
            const { insurant } = this.DATA;
            let number = this.insurants.length;
            if(number < this.insurantNum){
                this.insurants.map(item => {
                    item['isShow'] = false;
                    return item;
                });
                this.insurants.push(clone(insurant));
            }else{
                this.alertText = `被保人最多只能添加${number}个`;
                this.alertShow = true;
            }
        },

        // 删除被保人
        deleteHandler(index) {
            this.deleteIndex = index;
            this.confirmText = `确定删除第${index + 1}位被保人的信息吗？`;
            this.confirmShow = true;
        },

        // confirm/ 删除
        confirmHandler() {
            let index = this.deleteIndex;
            this.confirmShow = false;
            this.insurants.splice(index, 1);
            this.updateChoose();
        },

        // 是否同意
        changeAgreement() {
            this.isAgreement = !this.isAgreement;
        },

        // 资料
        linkHandler(type) {
            if(type === 'instruction'){
                location.href = '/product/instruction';
            }else if(type === 'clause'){
                const explainData = getSessionStore('explainData');
                const { insuranceClause } = explainData;
                if(insuranceClause && insuranceClause.length == 1){
                location.href = insuranceClause[0].clauseFileAddress;
                }else{
                location.href = "/product/clause";       
                }
            }else if(type === 'inform'){
                location.href = '/product/inform';
            }
        },

        // ------------------
        // 选择信息 end
        // ------------------

        // ------------------------------------

        // 更新被保人关系
        updateRelation(type) {
            let obj = {};
            const { businessRelation, insurantRelation } = this.DATA;
            if(type === 'enterprise'){
                obj = clone(businessRelation)
            }else{
                obj = clone(insurantRelation);
            }
            this.insurants.map((item, index) => {
                item['relation'] = obj;
                return item;
            })
        },

        // 更新选择
        async updateChoose(defaultType, type) {
            if(defaultType === 'insureType'){
                this.holder['type'] = type;
                if(type === 'enterprise'){
                    let info = await this.getEnterprise();
                    this.enterpriseHandler(0, info);
                }else if(type === 'appoint'){
                    this.holders = await this.getHolders();
                    this.appointHandler(-1)
                }
                this.updateRelation(type);
                return false;
            }

            if(this.startTime.errMsg) return false; // 如果起保时间不正确，不计算
            let currentPrice = 0;
            this.insurants.map((item, index) => {
                if(item.birthday){
                    let { price, priceFactors } = this.updateFinish(item.birthday);
                    currentPrice += price;
                    item.price = price;
                    item.priceFactors = priceFactors;
                }
                return item;
            })
            const detailData = getSessionStore('detailData');
            const { reduceRate } = detailData;
            let actualRate = (100 - parseInt(reduceRate)) / 100;
            let discountRate = parseInt(reduceRate)/100;
            this.totalFee = getPrice(currentPrice);
            this.actualPayFee = getPrice(currentPrice * actualRate);
            this.discountPrice = getPrice(currentPrice * discountRate) //优惠金额
        },

        // 计算价格
        updateFinish(birthday) {
            const detailData = getSessionStore('detailData');
            const { priceModes, birthdayList = [], priceFactors = [] } = detailData;

            let currentPriceMode = [],
                birthdayCode = '',
                priceFactorArr = [];
            birthdayList.map((item, index) => {
                let { lowerLimitValue: minAge, lowerLimitValueUnit: minUnit, upperLimitValue: maxAge, upperLimitValueUnit: maxUnit } = item;
                const { startDate, endDate } = dateRange(minUnit, minAge, maxUnit, maxAge, this.startTime.value);
                if(new Date(birthday.replace(/-/g, '/')).isBetween(startDate, endDate)){
                    birthdayCode = item.enumCode;
                    item['factorCode'] = 'insuredBirthday';
                    priceFactorArr.push(item);
                }
            });
            priceFactors.map((item, index) => {
                if(item.factorCode === 'insuredBirthday'){
                    currentPriceMode.push(birthdayCode);
                }else{
                    currentPriceMode.push(item.enumCode);
                }
            })

            let priceEnumIds = currentPriceMode.join('|');
            let currentPrice = priceModes[priceEnumIds] || 0;
            return { price: currentPrice, priceFactors: priceFactorArr };
        },

        // ------------------
        // 验证信息，提交信息 start
        // ------------------

        // 证件号码检测
        checkIDNumber(type, value) {
            let flag = false;
            type = Number(type);
            switch (type) {
                case 1:
                    flag = identityCardValidate(value);
                    break;
                case 2:
                    let reg = /^[a-zA-Z0-9]*$/;
                    flag = reg.test(value);
                    break;
                default:
                    if (value) {
                        flag = true;
                    }
                    break;
            }
            return flag;
        },

        // 验证被保人信息
        getInsurantValidate(index) {
            let flag = true;
            let number = this.insurants.length;
            const { relation, name, cardType, cardNo, birthday, gender } = this.insurants[index];
            const { relationShow, cardTypeShow, genderShow } = this.insurants[index];
            const { start, end } = this.DATA.birthday;
            if(relationShow && relation){
                const { dec } = relation;
                if(!dec){
                    this.insurants[index].relationErrMsg = '请输入与被保人的关系';
                    flag = false;
                }
            }
            if(!name){
                this.insurants[index].nameErrMsg = '请输入被保人姓名';
                flag = false;
            }else if(!userNameValidate(name)){
                this.insurants[index].nameErrMsg = '姓名为汉字或英文字符（至少两个字符）';
                flag = false;
            }
            if(cardTypeShow && cardType){
                const { dec } = cardType;
                if(!dec){
                    this.insurants[index].cardTypeErrMsg = '请选择被保人的证件类型';
                    flag = false;
                }
            }
            if(!cardNo){
                this.insurants[index].cardNoErrMsg = '请输入证件号码';
                flag = false;
            }else if(!this.checkIDNumber(cardTypeShow ? cardType.code : -1, cardNo)){
                this.insurants[index].cardNoErrMsg = '请填写正确的证件号码';
                flag = false;
            }else{
                const { type, person } = this.holder;
                if(type === 'appoint'){
                    if(relation.dec !== '本人' && person.cardNo === cardNo){
                        this.insurants[index].cardNoErrMsg = '被保人的证件号码与投保人相同，关系应为本人';
                        flag = false;
                    }
                }
            }
            if(!birthday){
                this.insurants[index].birthdayErrMsg = '请选择出生日期';
                flag = false;
            }else if(!new Date(birthday.replace(/-/g, '/')).isBetween(start, end)){
                this.insurants[index].birthdayErrMsg = '被保人年龄不符合投保要求';
                if(this.holder.type === 'appoint' && relation.dec === '本人'){
                    this.alertShow = true;
                    this.alertText = `被保人${number > 1 ? index + 1 : ''}年龄不符合投保要求`;
                }else if(cardType.dec === '身份证'){
                    this.alertShow = true;
                    this.alertText = `被保人${number > 1 ? index + 1 : ''}年龄不符合投保要求`;
                }
                flag = false;
            }
            if(genderShow && gender){
                const { dec } = gender;
                if(!dec){
                    this.insurants[index].genderErrMsg = '请选择被保人的性别';
                    flag = false;
                }
            }
            if(!flag) this.insurants[index].isShow = true;
            return flag;
        },

        // 验证投保类型为个人时，被保人必须有一个满18周岁
        checkFirstInsured() {
            const insurants = this.insurants;
            let falg = false;
            for(let i = 0; i < insurants.length; i++){
                let item = insurants[i];
                if(new Date(item.birthday.replace(/-/g, '/')).age() >= 18){

                    if(item['relationShow'] && item['relation']){
                        this.personHandler(i);
                    }
                    falg = true;
                    break;
                }
            }
            if(!falg){
                this.alertShow = true;
                this.alertText = '被保人必须有一个满18周岁';
            }
            return falg;
        },

        // 验证
        getValidate() {
            let flag = true;
            // 起保时间
            if(!this.startTime['value']){
                this.startTime['errMsg'] = '请选择起保日期';
                flag = false;
            }else if(!new Date(this.startTime['value'].replace(/-/g, '/')).isBetween(this.startTime['start'], this.startTime['end'])){
                this.startTime['errMsg'] = '起保时间不在承保范围内，请重新选择';
                flag = false;
            }

            // 航班号
            if(this.flight['isShow']){
                if(!this.flight['value']){
                    this.flight['errMsg'] = '请输入航班号';
                    flag = false;
                }else if(!flightValidate(this.flight['value'])){
                    this.flight['errMsg'] = '请输入正确的航班号';
                    flag = false;
                }
            }


            // 出发机场/到达机场
            if(this.startAirport['isShow']){
                if(!this.startAirport['value']){
                    this.startAirport['errMsg'] = '请选择出发机场';
                    flag = false;
                }

                if(!this.arriveAirport['value']){
                    this.arriveAirport['errMsg'] = '请选择到达机场';
                    flag = false;
                }
                if(this.startAirport['value'] && this.startAirport['value'] == this.arriveAirport['value']){
                    this.alertShow = true;
                    this.alertText = '出发机场和到达机场不能相同';
                    flag = false;
                }
            }

            // 投保人验证
            {
                let holderflag = true;
                if(this.holder['type'] === 'enterprise'){
                    const { name, cardType, cardNo, phone, email } = this.holder.enterprise;
                    if(!name){
                        this.holder.enterprise.nameErrMsg = '请输入企业名称';
                        holderflag = false;
                    }else if(!enterpriseNameValidate(name)) {
                        this.holder.enterprise.nameErrMsg = '企业名称不能少于4个字符';
                        holderflag = false;
                    }
                    if(!cardType){
                        this.holder.enterprise.cardTypeErrMsg = '请选择企业证件类型';
                        holderflag = false;
                    }
                    if(!cardNo){
                        this.holder.enterprise.cardNoErrMsg = '请输入企业证件号码';
                        holderflag = false;
                    }else if(cardNo.length < 7){
                        this.holder.enterprise.cardNoErrMsg = '企业证件号不能少于7个字符';
                        holderflag = false;
                    }
                    if(!phone){
                        this.holder.enterprise.phoneErrMsg = '请输入手机号码';
                        holderflag = false;
                    }else if(!phoneValidate(phone)){
                        this.holder.enterprise.phoneErrMsg = '请输入正确的企业手机号码';
                        holderflag = false;
                    }
                    if(!email){
                        this.holder.enterprise.emailErrMsg = '请输入电子邮箱';
                        holderflag = false;
                    }else if(!emailValidate(email)){
                        this.holder.enterprise.emailErrMsg = '请输入正确的电子邮箱';
                        holderflag = false;
                    }
                }else if(this.holder['type'] === 'appoint'){
                    const { name, cardTypeShow, cardType, cardNo, birthday, genderShow, gender, phone, email } = this.holder.person;
                    if(!name){
                        this.holder.person.nameErrMsg = '请输入投保人姓名';
                        holderflag = false;
                    }else if(!userNameValidate(name)){
                        this.holder.person.nameErrMsg = '姓名为汉字或英文字符（至少两个字符）';
                        holderflag = false;
                    }
                    if(cardTypeShow && cardType){
                        const { dec } = cardType
                        if(!dec){
                            this.holder.person.cardTypeErrMsg = '请选择证件类型';
                            holderflag = false;
                        }
                    }
                    if(!cardNo){
                        this.holder.person.cardNoErrMsg = '请输入证件号码';
                        holderflag = false;
                    }else if(!this.checkIDNumber(cardTypeShow ? cardType.code : -1, cardNo)){
                        this.holder.person.cardNoErrMsg = '请填写正确的证件号码';
                        holderflag = false;
                    }
                    if(!birthday){
                        this.holder.person.birthdayErrMsg = '请选择出生日期';
                        holderflag = false;
                    }else if(new Date(birthday.replace(/-/g, '/')).age() < 18){
                        this.holder.person.birthdayErrMsg = '投保人年龄不满18周岁不符合投保要求';
                        holderflag = false;
                    }
                    if(genderShow && gender){
                        const { dec } = gender;
                        if(!dec){
                            this.holder.person.genderErrMsg = '请选择性别';
                            holderflag = false;
                        }
                    }
                    if(!phone){
                        this.holder.person.phoneErrMsg = '请输入手机号码';
                        holderflag = false;
                    }else if(!phoneValidate(phone)){
                        this.holder.enterprise.phoneErrMsg = '请输入正确的手机号码';
                        holderflag = false;
                    }
                    if(!email){
                        this.holder.person.emailErrMsg = '请输入电子邮箱';
                        holderflag = false;
                    }else if(!emailValidate(email)){
                        this.holder.enterprise.emailErrMsg = '请输入正确的电子邮箱';
                        holderflag = false;
                    }
                }
                if(!holderflag){
                  flag = false;
                  this.holder.isShow = true;
                }
            }

            // 被保人验证
            {
                let relNum = 0;
                let cardNos = {}, repeteArr = [], tempsArr = [], cardNoMo = false;
                this.insurants.map((item, index) => {
                    if(!this.getInsurantValidate(index)){
                        flag = false;
                    }
                    if(item['cardNo']){
                        if(cardNos[item['cardNo']]){
                            cardNos[item['cardNo']].push(index);
                            cardNoMo = true;
                        }else{
                            cardNos[item['cardNo']] = [index];
                        }
                    }
                    const { relation, relationShow } = item;
                    if(relationShow && relation){
                        if(relation.dec === '本人'){
                            relNum++;
                        }
                    }
                });
                if(relNum > 1){
                    this.alertShow = true;
                    this.alertText = '投被保人关系为本人的只能有一个';
                    flag = false;
                }
                // for(let code in cardNos){
                //     if(cardNos[code].length > 1){
                //         repeteArr.push(cardNos[code])
                //     }
                // }
                // repeteArr.map((repeteElem) => {
                //     let tempRepeteElem = repeteElem.map((elem1) => {
                //         return elem1+1;
                //     });
                //     tempsArr.push(tempRepeteElem.join('/'));
                // });

                if(flag && cardNoMo){
                    this.alertShow = true;
                    this.alertText = '被保人证件号不能相同';
                    flag = false;
                }
            }

            const { type } = this.holder;
            if(flag && type === 'person' && !this.checkFirstInsured()){
                flag = false;
            }

            if(flag){
                if(!this.isAgreement){
                    this.alertShow = true;
                    this.alertText = '请仔细阅读保险须知、声明及条款';
                    flag = false;
                }
            }

            return flag;
        },

        getSubmitData() {
            const detailData = getSessionStore('detailData');
            const { productCode, safeguardPlanCode } = detailData;
            const priceFactors = this.priceFactors;
            const startTime = this.startTime;
            const tourGroup = this.tourGroup;
            const flight = this.flight;
            const startAirport = this.startAirport;
            const arriveAirport = this.arriveAirport;
            const { type, person, enterprise } = this.holder;
            const insurants = this.insurants;
            const totalFee = this.totalFee;
            const actualPayFee = this.actualPayFee;
            const discountPrice = this.discountPrice;
            let submitDATA = {};

            // 基本信息
            {
                let base = {
                    productCode,
                    safeguardPlanCode,
                    platid,
                    refId,
                    startTimeStr: startTime['temp'],
                    startTime: startTime['value'],
                    tourGroup: tourGroup['value'].alltrim(),
                    flight: flight['value'].alltrim(),
                    startAirport: startAirport['code'],
                    startAirportName: startAirport['value'],
                    arriveAirport: arriveAirport['code'],
                    arriveAirportName: arriveAirport['value'],
                    qty: insurants.length,
                    totalFee,
                    actualPayFee,
                    discountPrice,
                    insureType: this.insure.type,
                    insureMethod: this.insure.method
                }
                Object.assign(submitDATA, { base });
            }

            // 投保人信息
            {
                let personObj = {};
                {
                    let cardNo = person['cardNo'];
                    if(person['cardType'].code == 1){
                        cardNo = cardNo.toUpperCase();
                    }
                    personObj = {
                        name: person['name'],
                        cardNo: cardNo.alltrim(),
                        birthday: person['birthday'],
                        phone: person['phone'].alltrim(),
                        email: person['email'].alltrim()
                    }
                    if(person['cardTypeShow'] && person['cardType']){
                        Object.assign(personObj, { cardType: person['cardType']['code'], cardTypeDec: person['cardType']['dec'] });
                    }
                    if(person['genderShow'] && person['gender']){
                        Object.assign(personObj, { gender: person['gender']['code'], genderDec: person['gender']['dec'] });
                    }
                }
                let enterpriseObj = {
                    name: enterprise['name'],
                    cardType: enterprise['cardType'] ? enterprise['cardType']['code'] : '',
                    cardTypeDec: enterprise['cardType'] ? enterprise['cardType']['dec'] : '',
                    cardNo: enterprise['cardNo'].alltrim(),
                    phone: enterprise['phone'].alltrim(),
                    email: enterprise['email'].alltrim()
                };
                Object.assign(submitDATA, { holder: { type, person: personObj, enterprise: enterpriseObj } });
            }

            // 被保人信息
            {
                let insurantArr = [];
                insurants.map((item) => {
                    let cardNo = item['cardNo'];
                    if(item['cardType'].code == 1){
                        cardNo = cardNo.toUpperCase();
                    }
                    let obj = {
                        name: item['name'],
                        cardNo: cardNo.alltrim(),
                        birthday: item['birthday'],
                        price: item['price'],
                        priceFactors: item['priceFactors']
                    }
                    if(item['relationShow'] && item['relation']){
                        Object.assign(obj, { relation: item['relation']['code'], relationDec: item['relation']['dec'] })
                    }
                    if(item['cardTypeShow'] && item['cardType']){
                        Object.assign(obj, { cardType: item['cardType']['code'], cardTypeDec: item['cardType']['dec'] })
                    }
                    if(item['genderShow'] && item['gender']){
                        Object.assign(obj, { gender: item['gender']['code'], genderDec: item['gender']['dec'] })
                    }
                    insurantArr.push(obj);
                });
                Object.assign(submitDATA, { insurants: insurantArr });
            }
            Object.assign(submitDATA, { priceFactors })

            // submitDATA = {"base":{"productCode":"200059", safeguardPlanCode: '30243',"platid":"996","refId":"281778705","startTimeStr":"2017-12-24~2018-01-06","startTime":"2017-12-24","tourGroup":"","flight":"","startAirport":"","arriveAirport":"","qty":1,"totalFee":20,"actualPayFee":4,"discountPrice":16},"holder":{"type":"person","person":{"name":"asdfasd","cardNo":"12342134","birthday":"1995-12-23","phone":"18651104423","email":"","cardType":"2","cardTypeDec":"护照"},"enterprise":{"name":"","cardType":"","cardTypeDec":"","cardNo":"","phone":"","email":""}},"insurants":[{"name":"asdfasd","cardNo":"12342134","birthday":"1995-12-23","price":20,"priceFactors":[{"enumCode":"0D-100Y","enumName":"0天-100周岁","fixedValue":"","fixedValueUnit":"","lowerLimitValue":"0","lowerLimitValueUnit":"D","upperLimitValue":"100","upperLimitValueUnit":"Y","enumTemplateType":2,"enumTemplateValue":"","step":0,"isDefault":null,"value":"0","label":"0天-100周岁","factorCode":"insuredBirthday"}],"relation":"1","relationDec":"本人","cardType":"2","cardTypeDec":"护照","gender":"M","genderDec":"男"}],"priceFactors":[{"enumCode":"15D","enumName":"15天","fixedValue":"15","fixedValueUnit":"D","lowerLimitValue":"","lowerLimitValueUnit":"","upperLimitValue":"","upperLimitValueUnit":"","enumTemplateType":1,"enumTemplateValue":"","step":0,"isDefault":null,"value":"0","label":"15天","factorCode":"applyPeriod"}]}

            this.submitDATA = submitDATA;
        },

        // 立即投保按钮
        insureHandler() {
            if(!this.getValidate()) return;

            this.getSubmitData();
            this.isShowSure = true;
        },

        // 确认页
        cancelSureHandler() {
            this.isShowSure = false;
        },

        // 去下单
        async submitHandler() {
            const submitDATA = this.submitDATA;
            // console.log(JSON.stringify(submitDATA))
            const res = await order.add(submitDATA);
            const { code, data, message } = res;
            console.log(code)
            if(code === '0000'){
                const { orderCode } = data;
                location.href = `/orderPay/${orderCode}`
                // this.$router.push({ path: `/pay/${orderCode}` });
            }else if(code === '1001'){
                location.href = '/login';
            }else{
                this.alertShow = true;
                this.alertText = message;
            }
        }

        // ------------------
        // 验证信息，提交信息 end
        // ------------------
    }
}
</script>
