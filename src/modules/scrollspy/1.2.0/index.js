var Scrollspy = function (options) {
  var self = this;
  self.config = $.extend({}, self.defaults, options);
  //
  self.initial.call(self);
};
var Origin = Scrollspy.prototype;
/**
 * 榛樿鍙傛暟
 */
Origin.defaults = {
  //瀵艰埅fixed鍏冪礌
  navEl: null,
  //瀵艰埅鍒楄〃鐖跺厓绱�
  navListEl: null,
  //瀵艰埅鍒楄〃鍏冪礌
  navItemEl: null,
  //瀵艰埅閫変腑鏍峰紡
  currentCls: "current",
  //闇€瑕佹粴鍔ㄧ殑鍐呭鍖哄煙
  contentEl: null,
  //鍖哄煙瀵艰埅鏂囧瓧
  contentTxtCls: "data-txt",
  //鍖哄煙鍋忕Щ鍙傛暟
  contentShiftCls: "data-shift",
  //鍐呭鍖哄煙璺濈椤堕儴鐨勯珮搴�
  navTopH: 0,
  //鍐呭鍖哄煙璺濈椤堕儴鐨勯珮搴�
  renderNav: function (data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
      html += '<a class="" href="#' + data[i].id + '">' + data[i].txt + '</a>';
    }
    return html;
  },
  //瀵艰埅fixed鎿嶄綔
  fixedNav: function (el, sign) {
    switch (sign) {
      case 0:
        el.css({position: "static"});
        break;
      case 1:
        el.css({
          position: "fixed",
          display: "block"
        });
        break;
      case 2:
        el.css({display: "none"});
        break;
    }
  },
  //瑙﹀彂婊氬姩鎵ц
  scrollFn: {},
  //杩涘叆鍖哄煙鎵ц
  enterFn: {},
  //绗竴娆″埌杈炬墽琛�
  reachFn: {},
  //瓒呰繃鍒拌揪鎵ц
  loadFn: {}
};
/**
 * 鍒濆鍖栫洃鍚�
 */
Origin.initial = function () {
  var self = this,
    config = self.config;
  //鍒濆鍖栭厤缃弬鏁�
  config.navEl = $(config.navEl);
  if (config.navListEl) {
    config.navListEl = config.navEl.find(config.navListEl);
  } else {
    config.navListEl = config.navEl;
  }
  config.contentEl = $(config.contentEl);
  config.contentObj = [];
  config.contentEl.each(function (index, item) {
    var contobj = {};
    contobj.el = $(this);
    contobj.id = contobj.el.attr("id");
    contobj.txt = contobj.el.attr(config.contentTxtCls);
    contobj.shift = parseInt(contobj.el.attr(config.contentShiftCls)) || 0;
    //
    config.contentObj.push(contobj);
  });
  config.isEnter = '';
  config.isReach = {};
  config.isLoad = {};
  //娓叉煋瀵艰埅
  if (config.renderNav) {
    var html = config.renderNav.call(self, config.contentObj);
    config.navListEl.html(html);
  }
  //璁剧疆瀵艰埅鑺傜偣
  if (config.navItemEl) {
    config.navItemEl = config.navListEl.find(config.navItemEl);
  } else {
    config.navItemEl = config.navListEl.children();
  }
  //婊氬姩鍒濆
  self.scrollFlow();
  //婊氬姩浜嬩欢
  self.scrollEvent();
};
/**
 * 婊氬姩鏀瑰彉鐘舵€�
 */
Origin.scrollFlow = function () {
  var self = this,
    config = self.config;
  //
  if (!config.contentObj.length) return;
  //
  var winScrollTop = $(window).scrollTop(),
    docHeight = $(document).height(),
    winHeight = $(window).height(),
    maxScrollTop = docHeight - winHeight;
  //
  $.each(config.contentObj, function (index, item) {
    var Jelem = item.el;
    item.offsetTop = Jelem.offset().top - config.navTopH;
    //閲嶇疆fakeOffsetTop
    item.fakeOffsetTop = item.offsetTop;
    item.height = Jelem.height();
    item.offsetBot = Math.round(item.offsetTop + item.height);
    //閽堝璁剧疆鍋忕Щ閲忚缃甪akeOffsetTop
    if (item.shift) {
      item.fakeOffsetTop = item.offsetTop + item.shift;
    }
    //閽堝婊氬姩涓嶅埌鐨勫尯鍩熸坊鍔爁akeOffsetTop
    if (item.offsetTop >= maxScrollTop) {
      item.fakeOffsetTop = maxScrollTop;
    }
  });
  //
  var fistElTop = config.contentObj[0].offsetTop,
    lastElBot = config.contentObj[config.contentObj.length - 1].offsetBot,
  //鏄惁宸茬粡瓒呰繃涓婅竟鐣�
    isAbove = winScrollTop >= fistElTop,
  //鏄惁宸茬粡瓒呰繃涓嬭竟鐣�
    isBelow = winScrollTop >= lastElBot,
  //0涓烘湭瓒呰繃涓婅竟鐣�,1涓轰腑闂�,2涓鸿秴杩囦笅杈圭晫
    isDown = isAbove + isBelow;
  //
  config.fixedNav.call(self, config.navEl, isDown);
  //鎵ц鍥炶皟鏂规硶
  $.each(config.contentObj, function (index, item) {
    //鍒ゆ柇鏄惁杩涘叆鍖哄煙
    var offsetTop, nextItem, nextOffsetTop;
    offsetTop = item.fakeOffsetTop || item.offsetTop;
    nextItem = config.contentObj[index + 1];
    if (nextItem) {
      nextOffsetTop = nextItem.fakeOffsetTop || nextItem.offsetTop;
    } else {
      nextOffsetTop = item.offsetBot;
    }
    // hack 娴偣瀵艰嚧鐨勮绠楁湁璇�,鎵€浠ラ渶瑕�-2
    nextOffsetTop = nextOffsetTop - 2;
    //褰撴粴鍔ㄩ珮搴﹀ぇ浜庡厓绱犺窛椤堕珮搴� 涓� 灏忎簬涓嬩釜鍏冪礌璺濋《楂樺害
    if ((winScrollTop >= offsetTop) && (winScrollTop < nextOffsetTop)) {
      config.navItemEl.removeClass(config.currentCls);
      $(config.navItemEl[index]).addClass(config.currentCls);
      //鎵ц姣忎竴娆¤繘鍏ョ殑鏂规硶
      if (config.isEnter !== item.id) {
        config.isEnter = item.id;
        config.enterFn[item.id] && config.enterFn[item.id].call(self, item);
      }
      //鎵ц绗竴娆¤繘鍏ョ殑鏂规硶(鏈繘鍏ユ祻瑙堝櫒妗嗘椂鍔犺浇)
      if (!config.isReach[item.id]) {
        config.isReach[item.id] = true;
        config.reachFn[item.id] && config.reachFn[item.id].call(self, item);
      }
    }
    /**
     * 娴忚鍣ㄥ簳閮ㄥ凡瑙﹀強鍏冪礌椤堕儴鏃跺姞杞�(寰€涓嬫粴鍔�)
     * 褰撴祻瑙堝櫒椤堕儴婊氬姩鍒板厓绱犲簳閮ㄤ綅缃�(寰€涓婃粴鍔�)
     * (鏈繘鍏ユ祻瑙堝櫒妗嗘椂鍔犺浇)
     */
    if ((winScrollTop <= offsetTop) && (winScrollTop + winHeight >= offsetTop) || (winScrollTop >= offsetTop) && (winScrollTop < nextOffsetTop)) {
      //鎵ц绗竴娆¤繘鍏ョ殑鏂规硶(鏈繘鍏ユ祻瑙堝櫒妗嗘椂鍔犺浇)
      if (!config.isLoad[item.id]) {
        config.isLoad[item.id] = true;
        config.loadFn[item.id] && config.loadFn[item.id].call(self, item);
      }
    }
    //
    config.scrollFn[item.id] && config.scrollFn[item.id].call(self, item);
  });
};
/**
 * 鍒濆鍖栫洃鍚�
 */
Origin.scrollEvent = function () {
  var self = this,
    config = self.config;
  self.scrollEvent = function () {
    self.scrollFlow();
  };

  self.navClickEvent = function (e) {
    var Jself = $(this);
    config.navItemEl.removeClass(config.currentCls);
    Jself.addClass(config.currentCls);

    var Jthis = this.tagName.toLowerCase() == "a" ? $(this) : $(this).find("a"),
      contId = Jthis.attr("href"),
      offsetTop;
    //鑾峰彇
    for (var i = 0; i < config.contentObj.length; i++) {
      if (config.contentObj[i].id == contId.split("#")[1]) {
        offsetTop = config.contentObj[i].fakeOffsetTop || config.contentObj[i].offsetTop;
        break;
      }
    }
    if (!offsetTop) {
      offsetTop = $(contId).offset().top - config.navTopH;
    }
    $(window).scrollTop(offsetTop);
    e.preventDefault();
  }

  //婊氬姩鐩戝惉
  $(window).on("scroll", self.scrollEvent);
  //鐐瑰嚮鐩戝惉
  config.navItemEl.on("click", self.navClickEvent);
};
/**
 * 缁勪欢閿€姣�
 */
Origin.destroy = function (callback) {
  var self = this,
    config = self.config;
  $(window).off("scroll", self.scrollEvent);
  config.navItemEl.on("click", self.navClickEvent);
  //
  callback && callback.call(this);
};
/**
 * 娣诲姞jq鏂规硶
 */
$.scrollspy = function (options) {
  return new Scrollspy(options);
};
/**
 * 娣诲姞妯″潡鏂规硶
 */
module.exports = function (options) {
  return new Scrollspy(options);
};
