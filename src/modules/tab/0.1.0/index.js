define("tab/0.1.0/index",[],function(require,exports,module){
    module.exports = function(){
        (function(){
            $.fn.tab = function(){
                return this.each(function(){
                    var $div = $(this),
                        $li = $div.find(".tab-title").size() ? $div.find(".tab-title>li") : $div.find("ul>li"),
                        $pane = $div.find(".tab-content").size() ? $div.find(".tab-content>.tab-pane") : $div.find(">.tab-pane");
                    var event = $(this).attr("data-event") || "click";
                    event = $(this)[event] ? event : "click";
                    $li.each(function(){
                        var $self = $(this),
                            $tar = $self.find("a").length ? $self.find("a") : $self;
                        $tar.on(event,function(e){
                            if($tar[0].tagName.toLowerCase() === "a"){
                                e.preventDefault();
                            }
                            $li.removeClass("current");
                            $self.addClass("current");
                            $pane.hide();
                            $pane.eq($self.index()).show();
                        });
                    });
                });
            };
        })();
    };
});
