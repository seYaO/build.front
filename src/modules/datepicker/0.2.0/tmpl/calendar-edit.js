define("datepicker/0.2.0/tmpl/calendar-edit",[],function(require,exports,module) {

module.exports = function anonymous(it
/**/) {
var out='<div class="dj-calendar editor"> <div class="panel"> <div class="month-nav"> <a href="javascript:;" hidefocus="true" class="ico previous-month" data-btn-premonth></a> <a href="javascript:;" hidefocus="true" class="ico next-month" data-btn-nextmonth></a> <span class="title"> <a class="year" href="javascript:;">'+(it.months[0].year)+'年</a>  ';for(var i=0;i<6;i++){ out+=' ';var _month=i+it.months[0].month;if(_month>12)_month=_month-12;out+=' <a href="javascript:;" data-addmonth="'+(i)+'" data-year="'+(it.year)+'" data-month="'+(it.months[0].month)+'" class="month J_changemonth">'+(_month)+'月</a> '; } out+='  </span> </div> <table class="month-panel"> <thead> <tr class="header"> <th>'+(it.months[0].month)+'月</th> ';if((it.weekModel!=1)){out+=' <th class="sunday">星期日</th> ';}out+='  <th>星期一</th> <th>星期二</th> <th>星期三</th> <th>星期四</th> <th>星期五</th> <th class="saturday">星期六</th> ';if((it.weekModel==1)){out+=' <th class="sunday">星期日</th> ';}out+=' </tr> </thead> <tbody> ';var arr1=it.months[0].weeks;if(arr1){var week,index=-1,l1=arr1.length-1;while(index<l1){week=arr1[index+=1];out+=' <tr class="daterow"> <td>日期</td> ';var arr2=week;if(arr2){var day,weekday=-1,l2=arr2.length-1;while(weekday<l2){day=arr2[weekday+=1];out+=' ';var tdclass='';if(weekday==0) tdclass='sunday'; if(weekday==6) tdclass='saturday';out+=' <td class="'+(tdclass)+'" data-date="'+(day.date)+'">'+((day.date)?day.date:'')+'</td> ';} } out+=' </tr> <tr> <td>'+(it.weekTmpl)+'</td> ';var arr3=week;if(arr3){var day,weekday=-1,l3=arr3.length-1;while(weekday<l3){day=arr3[weekday+=1];out+=' <td class="J_day_data" data-date="'+(day.date)+'" data-value="'+(day.value)+'" data-day="'+(day.day)+'">'+(it.dayTmpl)+'</td> ';} } out+=' </tr> ';} } out+=' </tbody> </table> </div></div>';return out;
}

});