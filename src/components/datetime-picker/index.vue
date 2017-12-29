<template>
<popup :open="open" :history="history" @on-close="closeHandler">
    <div :class="classes">
        <div :class="['flexbox', cssPrefix + 'datetime-picker-header']">
            <button type="button" :class="[cssPrefix + 'datetime-picker-cancel']" @click="cancelHandler">{{cancelText}}</button>
            <div :class="['flexbox-item',cssPrefix + 'datetime-picker-today']">
                <!-- <button type="button" :class="[cssPrefix + 'datetime-picker-today']" @click="todayHandler">{{todayText}}</button> -->
            </div>
            <button type="button" :class="[cssPrefix + 'datetime-picker-confirm']" @click="confirmHandler">{{confirmText}}</button>
        </div>
        <divider></divider>
        <div :class="['flexbox',cssPrefix + 'datetime-picker']">
            <picker v-if="pickers" v-for="(item,index) in pickers" :class="['flexbox-item',cssPrefix + 'datetime-picker-item']" :index="index+'-'+item.type" :key="index+'-'+item.type" :data-type="item.type" :value="item.value" :placeholder="item.placeholder" :options="item.options" @on-change="changeHandler" />
        </div>
    </div>
</popup>
</template>

<script>
import { cssPrefix } from '@/utils/variable'
import '@/utils'
import Popup from '../popup'
import Picker from '../picker'
import Divider from '../divider'

let now = new Date()
const FORMAT_REG = /(yyyy)?[-]?(MM)?[-]?(dd)?[ ]?(HH)?[:]?(mm)?[:]?(ss)?/;
const FORMAT_MAP = {
    'yyyy': 'year',
    'MM': 'month',
    'dd': 'date',
    'HH': 'hour',
    'mm': 'minute',
    'ss': 'second'
};

export default {
    components: {
        Popup,
        Picker,
        Divider
    },
    props: {
        open: {
            type: Boolean,
            default: false
        },
        history: {
            type: Boolean,
            default: true
        },
        min: {
            type: String,
            default: '1900-01-01'
        },
        max: {
            type: String,
            default: `${now.getFullYear() + 20}-01-01`
        },
        value: {
            type: String,
            default: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}: ${now.getMinutes()}: ${now.getSeconds()}`
        },
        format: {
            type: String,
            default: 'yyyy-MM-dd'
        },
        locale: {
            type: Object,
            default () {
                return {
                    year: '年',
                    month: '月',
                    date: '日',
                    hour: '时',
                    minute: '分',
                    second: '秒'
                }
            }
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        confirmText: {
            type: String,
            default: '完成'
        },
        todayText: {
            type: String,
            default: '当前'
        },
        pickerIndex: {
            type: Number,
            default: 0
        },
        pickerType: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            cssPrefix,
            currentValue: '',
            current: '',
            pickers: [],
        }
    },
    computed: {
        classes () {
            return [cssPrefix + 'popup-picker-wrapper']
        },
        rims() {
            if (!this.currentValue) return { year: [], month: [], date: [], hour: [], min: [] };
            let startDate = new Date(this.min.replace(/-/g, '/'));
            let endDate = new Date(this.max.replace(/-/g, '/'));
            let result;
            result = {
                year: [startDate.getFullYear(), endDate.getFullYear()],
                month: [1, 12],
                date: [1, this.getMonthEndDay(this.updateYear(this.value), this.updateMonth(this.value))],
                hour: [0, 23],
                minute: [0, 59],
                second: [0, 59],
            };
            this.rimDetect(result, 'start');
            this.rimDetect(result, 'end');
            return result;
        },
    },
    mounted() {
        this.currentValue = this.value;
    },
    methods: {
        rimDetect(result, rim) {
            let position = rim === 'start' ? 0 : 1;
            let rimDate = rim === 'start' ? this.min : this.max;
            rimDate = new Date(rimDate.replace(/-/g, '/'));
            if (this.updateYear(this.currentValue) == rimDate.getFullYear()) {
                result.month[position] = rimDate.getMonth() + 1;
                if (this.updateMonth(this.currentValue) == rimDate.getMonth() + 1) {
                    result.date[position] = rimDate.getDate();
                    if (this.updateDate(this.currentValue) == rimDate.getDate()) {
                        result.hour[position] = rimDate.getHours();
                        if (this.updateHour(this.currentValue) == rimDate.getHours()) {
                            result.minute[position] = rimDate.getMinutes();
                            if (this.updateSecond(this.currentValue) == rimDate.getMinutes()) {
                                result.second[position] = rimDate.getSeconds();
                            }
                        }
                    }
                }
            }
        },
        isDateString(str) {
            return /\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}/.test(str);
        },
        updateYear(value) {
            return this.isDateString(value) ? value.split(' ')[0].split(/-|\/|\./)[0] : value.getFullYear();
        },
        updateMonth(value) {
            return this.isDateString(value) ? value.split(' ')[0].split(/-|\/|\./)[1] : value.getMonth() + 1;
        },
        updateDate(value) {
            return this.isDateString(value) ? value.split(' ')[0].split(/-|\/|\./)[2] : value.getDate();
        },
        updateHour(value) {
            if (this.isDateString(value)) {
                const str = value.split(' ')[1] || '00:00:00';
                return str.split(':')[0];
            }
            return value.getHours();
        },
        updateMinute(value) {
            if (this.isDateString(value)) {
                const str = value.split(' ')[1] || '00:00:00';
                return str.split(':')[1];
            }
            return value.getMinutes();
        },
        updateSecond(value) {
            if (this.isDateString(value)) {
                const str = value.split(' ')[1] || '00:00:00';
                return str.split(':')[2];
            }
            return value.getSeconds();
        },
        // 是否是闰年
        isLeapYear(year) {
            return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
        },
        // 是30天/否31天
        isShortMonth(month) {
            return [4, 6, 9, 11].indexOf(month) > -1;
        },
        // 根据月份计算天数
        getMonthEndDay(year, month) {
            if (this.isShortMonth(month)) {
                return 30;
            } else if (month === 2) {
                return this.isLeapYear(year) ? 29 : 28;
            } else {
                return 31;
            }
        },
        parseValue() {
            let value = this.currentValue;
            if (!/[-\/]/.test(value) && this.format !== 'yyyy') { //eslint-disable-line
                value = '1900-01-01 ' + value
            }
            let date = new Date(value.replace(/-/g, '/'))
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds()
            }
        },
        initial() {
            let parseDate = this.parseValue()
            let times = this.format.match(FORMAT_REG)
            let pickers = []
            times && times.splice(0,1);
            if(!(times && times[0])) return;
            times.map((item, index) => {
                if(item){
                    let type = FORMAT_MAP[item]
                    pickers.push({
                        options: this.getTimes(type),
                        value: String(parseDate[type]),
                        type: item
                    })
                }
            })
            this.pickers = pickers
        },
        getTimes(type) {
            let times = []
            let time = this.rims[type];
            for (let i = time[0]; i <= time[1]; i++) {
                let label = '';
                if(type === 'year'){
                    label = i + this.locale[type]
                }else{
                     label = (i < 10 ? '0' + String(i) : String(i)) + this.locale[type]
                }
                times.push({
                    label,
                    value: String(i)
                })
            }
            return times
        },        
        cancelHandler() {
            this.$emit('on-close', this.pickerIndex, this.pickerType)
        },
        closeHandler() {
            this.$emit('on-close', this.pickerIndex, this.pickerType)
        },
        confirmHandler() {
            let value = this.current
            this.open && this.$emit('on-change', value, this.pickerIndex, this.pickerType).$emit('input', value)
            value === this.value && this.closeHandler()
        },
        changeHandler(value, index) {
            let type = index.split('-')[1]
            index = index.split('-')[0]
            this.pickers[index].value = value
            let times = ["1900", "1", "1", "0", "0", "0"]
            this.pickers.forEach((item, index) => {
                times[index] = item['value'];
            })
            this.currentValue = `${times[0]}-${times[1]}-${times[2]} ${times[3]}:${times[4]}:${times[5]}`
        },
        todayHandler() {
            let map = {
                'yyyy': () => {
                    return new Date().getFullYear()
                },
                'MM': () => {
                    return new Date().getMonth() + 1
                },
                'dd': () => {
                    return new Date().getDate()
                },
                'hh': () => {
                    return new Date().getHours()
                },
                'mm': () => {
                    return new Date().getMinutes()
                },
                'ss': () => {
                    return new Date().getSeconds()
                }
            }
            for (let item of this.pickers) {
                if (map[item.type]) {
                    item.value = String(map[item.type]())
                }
            }
        },
        
    },
    watch: {
        open (value) {
            if(value){
                this.currentValue = this.currentValue || this.value;
            }
        },
        currentValue(value) {
            this.current = new Date(value.replace(/-/g, '/')).format(this.format)
            this.initial()
        },
        rims() {
            let times = ["1900", "1", "1", "0", "0", "0"]
            this.pickers.forEach((item, index) => {
                let type = FORMAT_MAP[item['type']]
                let min = this.rims[type][0];
                let max = this.rims[type][1];
                let value = '';
                if(item['value'] >= min && item['value'] <= max){
                    value = item['value'];
                }else{
                    value = min;
                }
                times[index] = value;
            })
            this.currentValue = `${times[0]}-${times[1]}-${times[2]} ${times[3]}:${times[4]}:${times[5]}`
        }
    }
}
</script>

<style lang="less">
@import './style.less';
</style>
