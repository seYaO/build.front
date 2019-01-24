;(function(){
	init();
})();

function init(){
	$("#list").on("click","a",function(e){
		var action = $(this).attr("attr-href");
		showContent(action, false);
	});
	//当用户单击浏览器的后退或前进按钮时触发该事件
	window.addEventListener("popstate",function(e){
		if(e.state && e.state.hash){
		 	var hash = e.state.hash ;
			showContent(hash, true);
		}
		else{
		 	return ;
		}
	},false);			
}

function showContent(name, noState){
	var url = name + ".txt";
	$.ajax({
		url : url ,
		dataType : "json",
		success : function(data){
			$("#content-main").text(data["content"]) ;
			$("title").html(name);
			var obj = {
					hash : name,
					title : "history"
				};
			if(noState){
				window.history.replaceState(obj,"",name + ".html");
			}else{
				window.history.pushState(obj,"",name + ".html");
			}
			
		}
	});
}