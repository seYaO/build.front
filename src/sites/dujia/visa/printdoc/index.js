var url = window.location.href;
function getParamFromUrl(name,isLowerCase) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var url = window.location.href;
        if(isLowerCase){
            url = url.toLowerCase();
        }
        var results = regex.exec(url);
        if (results == null) {
            return null;
        }
        else {
            return results[1];
        }
    };

    var parm = getParamFromUrl("typeId").replace(/[|]/g, ",");
    var url = window.location.href;
    var pId = url.split("print_")[1].split(".")[0];
    var save_linkUrl = "/dujia/AjaxCallNew.aspx?type=GetPrintContent&lineId="+pId;
    
    $(".save_link").attr("href",save_linkUrl);

$.ajax({
  url: "/intervacation/api/VisaInfo/GetVisaPrintMaterial?siteType=0&productId="+ pId +"&occupationalIdList="+ parm,
  dataType: "json",
  success: function (data) {

      var isInterview = data.Data.VisaPrintMaterial.IsInterview;
      if(isInterview == 0){
          var get_isInterview = "否"; 
      }else if(isInterview == 1){
          var get_isInterview = "是";
      }else if(isInterview == 2){
         var get_isInterview = "抽查"; 
      }

      $(".tab_table .before_info").html(
          '<td style="padding:15px 15px;">' + data.Data.VisaPrintMaterial.LsHandleItem +'</td>'+
          '<td style="padding:15px 15px;">' + data.Data.VisaPrintMaterial.LsVisaService +'</td>'+
          '<td style="padding:15px 15px;">'+ get_isInterview +'</td>'+
          '<td style="padding:15px 15px;">'+ data.Data.VisaPrintMaterial.ValidityTimes +'</td>'+
          '<td style="padding:15px 15px;">'+ data.Data.VisaPrintMaterial.MaxStopTimes +'</td>'
      );



      $(".all_title").html(data.Data.VisaPrintMaterial.MainTitle);
      if(data.Data.VisaPrintMaterial.VisaMaterial && data.Data.VisaPrintMaterial.VisaMaterial.length > 0){
        for(var i = 0; i < data.Data.VisaPrintMaterial.VisaMaterial.length; i++){
                var getVisaTye = data.Data.VisaPrintMaterial.VisaMaterial[i].PersonalTypeName;
                var tableTit = '<div class="table2_title">办签人员：'+ getVisaTye +'</div>'+'<div class="getTable_stuffInfo">replaceEle</div>'
                // $(".getTable_stuff").append('<div class="table2_title">办签人员：'+ getVisaTye +'</div>'+'<div class="getTable_stuffInfo">&</div>'  );
                var tableEle="";
            for(var j = 0; j < data.Data.VisaPrintMaterial.VisaMaterial[i].MaterialDetailList.length; j++){
                var getTypeName = data.Data.VisaPrintMaterial.VisaMaterial[i].MaterialDetailList[j].Name,
                    getInfoDetail = data.Data.VisaPrintMaterial.VisaMaterial[i].MaterialDetailList[j].Content,
                    isNecessary = data.Data.VisaPrintMaterial.VisaMaterial[i].MaterialDetailList[j].IsNecessary == 1 ? "★" : "●";;
                tableEle+='<table border="1" class="tab_table2" typeId="">'+
                    '<tbody>'+
                        '<tr>'+
                            '<td style="color:#333;width:178px;text-align: center">'+ isNecessary + getTypeName +'</td>'+
                            '<td style="padding: 15px;">'+ getInfoDetail +'</td>'+
                        '</tr>'+
                    '</tbody>'+      
                '</table>' ;
        }
                  $(".getTable_stuff").append( tableTit.replace(/replaceEle/g,tableEle));
          
        }
        
      }else{
          $(".table_stuff").css("display","none");
      }
    
      if(data.Data.VisaPrintMaterial.InterVisaMaterial && data.Data.VisaPrintMaterial.InterVisaMaterial.length > 0){
          $(".stuff_tip").html("*申请人在面试当天携带以下真实资料到"+data.Data.VisaPrintMaterial.CountryName+"领馆签证处面试即可（面试材料无需提供给同程旅游签证部）");
        for(var i = 0; i < data.Data.VisaPrintMaterial.InterVisaMaterial.length; i++){
                var getVisaTye = data.Data.VisaPrintMaterial.InterVisaMaterial[i].PersonalTypeName;
                $(".getTable_Inter").append('<div class="table2_title">办签人员：'+ getVisaTye +'</div>'+'<div class="getTableInfo_InterInfo">'+'</div>'  );
            for(var j = 0; j < data.Data.VisaPrintMaterial.InterVisaMaterial[i].MaterialDetailList.length; j++){
                var getTypeName = data.Data.VisaPrintMaterial.InterVisaMaterial[i].MaterialDetailList[j].Name,
                    getInfoDetail = data.Data.VisaPrintMaterial.InterVisaMaterial[i].MaterialDetailList[j].Content,
                    isNecessary = data.Data.VisaPrintMaterial.InterVisaMaterial[i].MaterialDetailList[j].IsNecessary == 1 ? "★" : "●";
                    $(".getTableInfo_InterInfo").append(
                        '<table border="1" class="tab_table2" typeId="">'+
                            '<tbody>'+
                                '<tr>'+
                                    '<td style="color:#333;width:178px;text-align: center">'+ isNecessary + getTypeName +'</td>'+
                                    '<td style="padding: 15px;">'+ getInfoDetail +'</td>'+
                                '</tr>'+
                            '</tbody>'+      
                        '</table>' 
                );
            }
        }
      }else{
          $(".table_inter").css("display","none");
      }
    
      var otherInfo = data.Data.VisaPrintMaterial.VisaNotice;
      $(".import_content").html(otherInfo);
  } 
});

var d = new Date();
var str = d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日";
$(".sent_date").html(str);
