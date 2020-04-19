
     $(document).ready(function (){
           $.ajax({
                    url: "http://m.ly.com/dujia/AjaxHelper/GetRefidTelphone",
                    dataType: "jsonp",
                    success:function(datas){
                        var tel = datas.tel;
                        var status=datas.status;
                        switch (status) {
                            case 100:
                                $(' .service-first').attr('href',"tel:"+tel); 
                                break;
                            default:  
                                break;
                        }
                    }
                });  
        });   
