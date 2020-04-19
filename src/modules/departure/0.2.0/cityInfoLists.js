/**
 * Created by wj12961 on 2016/1/6.
 */
var cityInfo = {
    startList: [{
        "FirstLetter": "A",
        "MatchCitys": [{"Id": 245, "Name": "鞍山", "Pinyin": "anshan"}, {
            "Id": 5451,
            "Name": "阿纳海姆",
            "Pinyin": "ANAHAIMU"
        }, {"Id": 311, "Name": "安康", "Pinyin": "ankang"}, {
            "Id": 259,
            "Name": "阿拉善盟",
            "Pinyin": "ALaShanMeng"
        }, {"Id": 4695, "Name": "奥克兰", "Pinyin": "AOKELAN"}, {"Id": 351, "Name": "阿克苏", "Pinyin": "akesu"}, {
            "Id": 344,
            "Name": "阿里",
            "Pinyin": "ali"
        }, {"Id": 352, "Name": "阿拉尔", "Pinyin": "alaer"}, {"Id": 112, "Name": "安顺", "Pinyin": "anshun"}, {
            "Id": 150,
            "Name": "安阳",
            "Pinyin": "anyang"
        }, {"Id": 3114, "Name": "阿勒泰", "Pinyin": "aletai"}, {
            "Id": 322,
            "Name": "阿坝藏族羌族自治州",
            "Pinyin": "ABaZangZuQiangZuZiZhiZhou"
        }, {"Id": 36, "Name": "安庆", "Pinyin": "anqing"}, {"Id": 4488, "Name": "埃格勒", "Pinyin": "AIGELE"}, {
            "Id": 5072,
            "Name": "奥兰多",
            "Pinyin": "AOLANDUO"
        }, {"Id": 396, "Name": "澳门", "Pinyin": "aomen"}]
    }, {
        "FirstLetter": "B",
        "MatchCitys": [{"Id": 53, "Name": "北京", "Pinyin": "beijing"}, {
            "Id": 63,
            "Name": "白银",
            "Pinyin": "baiyin"
        }, {"Id": 212, "Name": "白城", "Pinyin": "baicheng"}, {"Id": 312, "Name": "宝鸡", "Pinyin": "baoji"}, {
            "Id": 99,
            "Name": "北海",
            "Pinyin": "beihai"
        }, {"Id": 37, "Name": "蚌埠", "Pinyin": "bengbu"}, {"Id": 139, "Name": "保定", "Pinyin": "baoding"}, {
            "Id": 367,
            "Name": "保山",
            "Pinyin": "baoshan"
        }, {"Id": 122, "Name": "保亭黎族苗族自治县", "Pinyin": "BaoTingLiZuMiaoZuZiZhiXian"}, {
            "Id": 260,
            "Name": "巴彦淖尔市",
            "Pinyin": "BaYanNaoErShi"
        }, {"Id": 121, "Name": "白沙黎族自治县", "Pinyin": "BaiShaLiZuZiZhiXian"}, {
            "Id": 98,
            "Name": "百色",
            "Pinyin": "baise"
        }, {"Id": 354, "Name": "博尔塔拉蒙古自治州", "Pinyin": "BoErTaLaMengGuZiZhiZhou"}, {
            "Id": 261,
            "Name": "包头",
            "Pinyin": "baotou"
        }, {"Id": 323, "Name": "巴中", "Pinyin": "bazhong"}, {"Id": 113, "Name": "毕节", "Pinyin": "bijie"}, {
            "Id": 246,
            "Name": "本溪",
            "Pinyin": "benxi"
        }, {"Id": 5528, "Name": "波高尔宾", "Pinyin": "BoGaoErBin"}, {
            "Id": 353,
            "Name": "巴音郭楞蒙古自治州",
            "Pinyin": "BaYinGuoLengMengGuZiZhiZhou"
        }, {"Id": 6049, "Name": "布法罗", "Pinyin": "BUFALUO"}, {"Id": 283, "Name": "滨州", "Pinyin": "binzhou"}, {
            "Id": 213,
            "Name": "白山",
            "Pinyin": "baishan"
        }]
    },
        {
        "FirstLetter": "C",
        "MatchCitys": [{"Id": 324, "Name": "成都", "Pinyin": "chengdu"}, {
            "Id": 394,
            "Name": "重庆",
            "Pinyin": "ChongQing"
        }, {"Id": 199, "Name": "长沙", "Pinyin": "changsha"}, {
            "Id": 221,
            "Name": "常州",
            "Pinyin": "changzhou"
        }, {"Id": 300, "Name": "长治", "Pinyin": "changzhi"}, {"Id": 141, "Name": "承德", "Pinyin": "chengde"}, {
            "Id": 123,
            "Name": "昌江黎族自治县",
            "Pinyin": "ChangJiangLiZuZiZhiXian"
        }, {"Id": 345, "Name": "昌都", "Pinyin": "changdu"}, {"Id": 100, "Name": "崇左", "Pinyin": "chongzuo"}, {
            "Id": 198,
            "Name": "常德",
            "Pinyin": "changde"
        }, {"Id": 39, "Name": "池州", "Pinyin": "chizhou"}, {"Id": 247, "Name": "朝阳", "Pinyin": "chaoyang"}, {
            "Id": 4569,
            "Name": "长白山保护区",
            "Pinyin": "changbaishanbaohuqu"
        }, {"Id": 124, "Name": "澄迈县", "Pinyin": "ChengMaiXian"}, {
            "Id": 262,
            "Name": "赤峰",
            "Pinyin": "chifeng"
        }, {"Id": 38, "Name": "巢湖", "Pinyin": "chaohu"}, {
            "Id": 368,
            "Name": "楚雄彝族自治州",
            "Pinyin": "ChuXiongYiZuZiZhiZhou"
        }, {"Id": 355, "Name": "昌吉回族自治州", "Pinyin": "ChangJiHuiZuZiZhiZhou"}, {
            "Id": 77,
            "Name": "潮州",
            "Pinyin": "chaozhou"
        }, {"Id": 140, "Name": "沧州", "Pinyin": "cangzhou"}, {"Id": 40, "Name": "滁州", "Pinyin": "chuzhou"}, {
            "Id": 200,
            "Name": "郴州",
            "Pinyin": "chenzhou"
        }, {"Id": 214, "Name": "长春", "Pinyin": "changchun"}]
    },
        {
        "FirstLetter": "D",
        "MatchCitys": [{"Id": 369, "Name": "大理", "Pinyin": "dali"}, {
            "Id": 138,
            "Name": "儋州",
            "Pinyin": "danzhou"
        }, {"Id": 125, "Name": "定安县", "Pinyin": "DingAnXian"}, {
            "Id": 370,
            "Name": "德宏傣族景颇族自治州",
            "Pinyin": "DeHongDaiZuJingPoZuZiZhiZhou"
        }, {"Id": 325, "Name": "达州", "Pinyin": "dazhou"}, {"Id": 126, "Name": "东方", "Pinyin": "dongfang"}, {
            "Id": 284,
            "Name": "德州",
            "Pinyin": "dezhou"
        }, {"Id": 326, "Name": "德阳", "Pinyin": "deyang"}, {"Id": 168, "Name": "大庆", "Pinyin": "daqing"}, {
            "Id": 249,
            "Name": "丹东",
            "Pinyin": "dandong"
        }, {"Id": 285, "Name": "东营", "Pinyin": "dongying"}, {
            "Id": 371,
            "Name": "迪庆藏族自治州",
            "Pinyin": "DiQingZangZuZiZhiZhou"
        }, {"Id": 169, "Name": "大兴安岭", "Pinyin": "daxinganling"}, {
            "Id": 5923,
            "Name": "达姆施塔特",
            "Pinyin": "DAMUSHITATE"
        }, {"Id": 64, "Name": "定西", "Pinyin": "dingxi"}, {"Id": 301, "Name": "大同", "Pinyin": "datong"}, {
            "Id": 78,
            "Name": "东莞",
            "Pinyin": "dongguan"
        }, {"Id": 248, "Name": "大连", "Pinyin": "dalian"}]
    },
        {
        "FirstLetter": "E",
        "MatchCitys": [{"Id": 182, "Name": "恩施土家族苗族自治州", "Pinyin": "EnShiTuJiaZuMiaoZuZiZhiZhou"}, {
            "Id": 181,
            "Name": "鄂州",
            "Pinyin": "ezhou"
        }, {"Id": 263, "Name": "鄂尔多斯", "Pinyin": "eerduosi"}]
    },
        {
        "FirstLetter": "F",
        "MatchCitys": [{"Id": 16166, "Name": "弗雷斯诺", "Pinyin": "FuLeiSiNuo"}, {
            "Id": 234,
            "Name": "抚州",
            "Pinyin": "FuZhou"
        }, {"Id": 101, "Name": "防城港", "Pinyin": "fangchenggang"}, {
            "Id": 41,
            "Name": "阜阳",
            "Pinyin": "fuyang"
        }, {"Id": 250, "Name": "抚顺", "Pinyin": "fushun"}, {
            "Id": 3124,
            "Name": "法兰克福",
            "Pinyin": "FALANKEFU"
        }, {"Id": 251, "Name": "阜新", "Pinyin": "fuxin"}, {"Id": 79, "Name": "佛山", "Pinyin": "foshan"}, {
            "Id": 54,
            "Name": "福州",
            "Pinyin": "fuzhou"
        }]
    },
        {
        "FirstLetter": "G",
        "MatchCitys": [{"Id": 80, "Name": "广州", "Pinyin": "guangzhou"}, {
            "Id": 329,
            "Name": "广元",
            "Pinyin": "guangyuan"
        }, {"Id": 271, "Name": "固原", "Pinyin": "guyuan"}, {"Id": 102, "Name": "桂林", "Pinyin": "guilin"}, {
            "Id": 397,
            "Name": "高雄",
            "Pinyin": "gaoxiong"
        }, {"Id": 328, "Name": "广安", "Pinyin": "guangan"}, {
            "Id": 275,
            "Name": "果洛藏族自治州",
            "Pinyin": "GuoLuoZangZuZiZhiZhou"
        }, {"Id": 6860, "Name": "高嘉华", "Pinyin": "gaojiahua"}, {
            "Id": 103,
            "Name": "贵港",
            "Pinyin": "guigang"
        }, {"Id": 65, "Name": "甘南藏族自治州", "Pinyin": "GanNanZangZuZiZhiZhou"}, {
            "Id": 327,
            "Name": "甘孜藏族自治州",
            "Pinyin": "GanZiZangZuZiZhiZhou"
        }, {"Id": 235, "Name": "赣州", "Pinyin": "ganzhou"}, {"Id": 114, "Name": "贵阳", "Pinyin": "guiyang"}]
    },
        {
        "FirstLetter": "H",
        "MatchCitys": [{"Id": 383, "Name": "杭州", "Pinyin": "hangzhou"}, {
            "Id": 384,
            "Name": "湖州",
            "Pinyin": "huzhou"
        }, {"Id": 42, "Name": "合肥", "Pinyin": "hefei"}, {"Id": 277, "Name": "海东", "Pinyin": "haidong"}, {
            "Id": 313,
            "Name": "汉中",
            "Pinyin": "hanzhong"
        }, {"Id": 143, "Name": "衡水", "Pinyin": "hengshui"}, {
            "Id": 280,
            "Name": "黄南藏族自治州",
            "Pinyin": "HuangNanZangZuZiZhiZhou"
        }, {"Id": 43, "Name": "淮北", "Pinyin": "huaibei"}, {"Id": 171, "Name": "鹤岗", "Pinyin": "hegang"}, {
            "Id": 151,
            "Name": "鹤壁",
            "Pinyin": "hebi"
        }, {"Id": 398, "Name": "花莲", "Pinyin": "hualian"}, {"Id": 82, "Name": "惠州", "Pinyin": "huizhou"}, {
            "Id": 45,
            "Name": "黄山",
            "Pinyin": "huangshan"
        }, {"Id": 44, "Name": "淮南", "Pinyin": "huainan"}, {"Id": 356, "Name": "哈密", "Pinyin": "hami"}, {
            "Id": 105,
            "Name": "贺州",
            "Pinyin": "hezhou"
        }, {"Id": 278, "Name": "海南藏族自治州", "Pinyin": "HaiNanZangZuZiZhiZhou"}, {
            "Id": 276,
            "Name": "海北藏族自治州",
            "Pinyin": "HaiBeiZangZuZiZhiZhou"
        }, {"Id": 286, "Name": "菏泽", "Pinyin": "heze"}, {"Id": 142, "Name": "邯郸", "Pinyin": "handan"}, {
            "Id": 252,
            "Name": "葫芦岛",
            "Pinyin": "huludao"
        }, {"Id": 202, "Name": "怀化", "Pinyin": "huaihua"}, {"Id": 5931, "Name": "哈瑙", "Pinyin": "HANAO"}, {
            "Id": 172,
            "Name": "黑河",
            "Pinyin": "heihe"
        }, {"Id": 184, "Name": "黄石", "Pinyin": "huangshi"}, {"Id": 183, "Name": "黄冈", "Pinyin": "huanggang"}, {
            "Id": 81,
            "Name": "河源",
            "Pinyin": "heyuan"
        }, {"Id": 201, "Name": "衡阳", "Pinyin": "hengyang"}, {"Id": 52, "Name": "亳州", "Pinyin": "HaoZhou"}, {
            "Id": 104,
            "Name": "河池",
            "Pinyin": "hechi"
        }, {"Id": 372, "Name": "红河哈尼族彝族自治州", "Pinyin": "HongHeHaNiZuYiZuZiZhiZhou"}, {
            "Id": 357,
            "Name": "和田",
            "Pinyin": "hetian"
        }, {"Id": 279, "Name": "海西蒙古族藏族自治州", "Pinyin": "HaiXiMengGuZuZangZuZiZhiZhou"}, {
            "Id": 265,
            "Name": "呼伦贝尔",
            "Pinyin": "hulunbeier"
        }, {"Id": 222, "Name": "淮安", "Pinyin": "huaian"}, {"Id": 127, "Name": "海口", "Pinyin": "haikou"}, {
            "Id": 170,
            "Name": "哈尔滨",
            "Pinyin": "haerbin"
        }, {"Id": 264, "Name": "呼和浩特", "Pinyin": "huhehaote"}]
    },
        {
        "FirstLetter": "J",
        "MatchCitys": [{"Id": 385, "Name": "嘉兴", "Pinyin": "jiaxing"}, {
            "Id": 237,
            "Name": "景德镇",
            "Pinyin": "jingdezhen"
        }, {"Id": 302, "Name": "晋城", "Pinyin": "jincheng"}, {"Id": 5127, "Name": "金门", "Pinyin": "jinmen"}, {
            "Id": 67,
            "Name": "金昌",
            "Pinyin": "jinchang"
        }, {"Id": 68, "Name": "酒泉", "Pinyin": "jiuquan"}, {"Id": 84, "Name": "揭阳", "Pinyin": "jieyang"}, {
            "Id": 303,
            "Name": "晋中",
            "Pinyin": "jinzhong"
        }, {"Id": 66, "Name": "嘉峪关", "Pinyin": "jiayuguan"}, {"Id": 153, "Name": "焦作", "Pinyin": "jiaozuo"}, {
            "Id": 400,
            "Name": "嘉义",
            "Pinyin": "jiayi"
        }, {"Id": 4244, "Name": "旧金山", "Pinyin": "JIUJINSHAN"}, {
            "Id": 238,
            "Name": "九江",
            "Pinyin": "jiujiang"
        }, {"Id": 399, "Name": "基隆", "Pinyin": "jilong"}, {"Id": 186, "Name": "荆州", "Pinyin": "jingzhou"}, {
            "Id": 83,
            "Name": "江门",
            "Pinyin": "jiangmen"
        }, {"Id": 5457, "Name": "基韦斯特", "Pinyin": "JIWEISITE"}, {
            "Id": 253,
            "Name": "锦州",
            "Pinyin": "jinzhou"
        }, {"Id": 288, "Name": "济宁", "Pinyin": "jining"}, {"Id": 174, "Name": "佳木斯", "Pinyin": "jiamusi"}, {
            "Id": 5531,
            "Name": "金斯克里福",
            "Pinyin": "JINSIKELIFU"
        }, {"Id": 236, "Name": "吉安", "Pinyin": "jian"}, {"Id": 185, "Name": "荆门", "Pinyin": "jingmen"}, {
            "Id": 152,
            "Name": "济源",
            "Pinyin": "jiyuan"
        }, {"Id": 215, "Name": "吉林", "Pinyin": "jilin"}, {"Id": 173, "Name": "鸡西", "Pinyin": "jixi"}, {
            "Id": 287,
            "Name": "济南",
            "Pinyin": "jinan"
        }, {"Id": 386, "Name": "金华", "Pinyin": "jinhua"}]
    },
        {
        "FirstLetter": "K",
        "MatchCitys": [{"Id": 360, "Name": "克孜勒苏柯尔克孜自治州", "Pinyin": "KeZiLeSuKeErKeZiZiZhiZhou"}, {
            "Id": 358,
            "Name": "喀什",
            "Pinyin": "kashi"
        }, {"Id": 5459, "Name": "克利尔沃特", "Pinyin": "KeLiErWoTe"}, {
            "Id": 5588,
            "Name": "卡塞尔",
            "Pinyin": "KaSaiEr"
        }, {"Id": 154, "Name": "开封", "Pinyin": "kaifeng"}, {
            "Id": 359,
            "Name": "克拉玛依",
            "Pinyin": "kelamayi"
        }, {"Id": 16165, "Name": "卡梅尔", "Pinyin": "KaMeiEr"}, {"Id": 373, "Name": "昆明", "Pinyin": "kunming"}]
    },
        {
        "FirstLetter": "L",
        "MatchCitys": [{"Id": 223, "Name": "连云港", "Pinyin": "lianyungang"}, {
            "Id": 70,
            "Name": "临夏回族自治州",
            "Pinyin": "LinXiaHuiZuZiZhiZhou"
        }, {"Id": 155, "Name": "洛阳", "Pinyin": "luoyang"}, {"Id": 289, "Name": "莱芜", "Pinyin": "laiwu"}, {
            "Id": 342,
            "Name": "泸州",
            "Pinyin": "luzhou"
        }, {"Id": 107, "Name": "柳州", "Pinyin": "liuzhou"}, {
            "Id": 4246,
            "Name": "洛杉矶",
            "Pinyin": "LuoShanJi"
        }, {"Id": 375, "Name": "临沧", "Pinyin": "lincang"}, {
            "Id": 129,
            "Name": "临高县",
            "Pinyin": "LinGaoXian"
        }, {"Id": 166, "Name": "漯河", "Pinyin": "luohe"}, {"Id": 46, "Name": "六安", "Pinyin": "liuan"}, {
            "Id": 374,
            "Name": "丽江",
            "Pinyin": "lijiang"
        }, {"Id": 304, "Name": "临汾", "Pinyin": "linfen"}, {
            "Id": 128,
            "Name": "乐东黎族自治县",
            "Pinyin": "LeDongLiZuZiZhiXian"
        }, {"Id": 254, "Name": "辽阳", "Pinyin": "liaoyang"}, {"Id": 330, "Name": "乐山", "Pinyin": "leshan"}, {
            "Id": 331,
            "Name": "凉山彝族自治州",
            "Pinyin": "LiangShanYiZuZiZhiZhou"
        }, {"Id": 71, "Name": "陇南", "Pinyin": "longnan"}, {"Id": 106, "Name": "来宾", "Pinyin": "laibin"}, {
            "Id": 291,
            "Name": "临沂",
            "Pinyin": "linyi"
        }, {"Id": 305, "Name": "吕梁", "Pinyin": "lvliang"}, {"Id": 346, "Name": "拉萨", "Pinyin": "lasa"}, {
            "Id": 130,
            "Name": "陵水黎族自治县",
            "Pinyin": "LingShuiLiZuZiZhiXian"
        }, {"Id": 55, "Name": "龙岩", "Pinyin": "longyan"}, {
            "Id": 115,
            "Name": "六盘水",
            "Pinyin": "liupanshui"
        }, {"Id": 290, "Name": "聊城", "Pinyin": "liaocheng"}, {"Id": 387, "Name": "丽水", "Pinyin": "lishui"}, {
            "Id": 216,
            "Name": "辽源",
            "Pinyin": "liaoyuan"
        }, {"Id": 4245, "Name": "拉斯维加斯", "Pinyin": "LASIWEIJIASI"}, {
            "Id": 347,
            "Name": "林芝",
            "Pinyin": "linzhi"
        }, {"Id": 5299, "Name": "劳德代尔堡", "Pinyin": "LaoDeDaiErBao"}, {
            "Id": 203,
            "Name": "娄底",
            "Pinyin": "loudi"
        }, {"Id": 69, "Name": "兰州", "Pinyin": "lanzhou"}, {"Id": 144, "Name": "廊坊", "Pinyin": "langfang"}]
    },
        {
        "FirstLetter": "M",
        "MatchCitys": [{"Id": 85, "Name": "茂名", "Pinyin": "maoming"}, {
            "Id": 5460,
            "Name": "迈阿密",
            "Pinyin": "MAIAMI"
        }, {"Id": 5117, "Name": "苗栗", "Pinyin": "miaoli"}, {"Id": 3253, "Name": "马累", "Pinyin": "MaLei"}, {
            "Id": 332,
            "Name": "眉山",
            "Pinyin": "meishan"
        }, {"Id": 86, "Name": "梅州", "Pinyin": "meizhou"}, {
            "Id": 4336,
            "Name": "蒙特勒",
            "Pinyin": "MENGTELE"
        }, {"Id": 5461, "Name": "蒙特里", "Pinyin": "MENGTELI"}, {
            "Id": 175,
            "Name": "牡丹江",
            "Pinyin": "mudanjiang"
        }, {"Id": 333, "Name": "绵阳", "Pinyin": "mianyang"}, {"Id": 47, "Name": "马鞍山", "Pinyin": "maanshan"}]
    },
        {
        "FirstLetter": "N",
        "MatchCitys": [{"Id": 224, "Name": "南京", "Pinyin": "nanjing"}, {
            "Id": 388,
            "Name": "宁波",
            "Pinyin": "ningbo"
        }, {"Id": 57, "Name": "宁德", "Pinyin": "ningde"}, {"Id": 348, "Name": "那曲", "Pinyin": "naqu"}, {
            "Id": 334,
            "Name": "南充",
            "Pinyin": "nanchong"
        }, {"Id": 156, "Name": "南阳", "Pinyin": "nanyang"}, {"Id": 4249, "Name": "纽约", "Pinyin": "NIUYUE"}, {
            "Id": 376,
            "Name": "怒江傈僳族自治州",
            "Pinyin": "NuJiangLiSuZuZiZhiZhou"
        }, {"Id": 5119, "Name": "南投", "Pinyin": "nantou"}, {"Id": 335, "Name": "内江", "Pinyin": "neijiang"}, {
            "Id": 56,
            "Name": "南平",
            "Pinyin": "nanping"
        }, {"Id": 4767, "Name": "纽卡斯尔", "Pinyin": "NiuKaSiEr"}, {
            "Id": 239,
            "Name": "南昌",
            "Pinyin": "nanchang"
        }, {"Id": 108, "Name": "南宁", "Pinyin": "nanning"}, {"Id": 225, "Name": "南通", "Pinyin": "nantong"}]
    },
        {
        "FirstLetter": "P",
        "MatchCitys": [{"Id": 5130, "Name": "澎湖", "Pinyin": "penghu"}, {
            "Id": 378,
            "Name": "普洱",
            "Pinyin": "puer"
        }, {"Id": 336, "Name": "攀枝花", "Pinyin": "panzhihua"}, {"Id": 58, "Name": "莆田", "Pinyin": "putian"}, {
            "Id": 72,
            "Name": "平凉",
            "Pinyin": "pingliang"
        }, {"Id": 5121, "Name": "屏东", "Pinyin": "pingdong"}, {
            "Id": 240,
            "Name": "萍乡",
            "Pinyin": "pingxiang"
        }, {"Id": 255, "Name": "盘锦", "Pinyin": "panjin"}, {"Id": 167, "Name": "濮阳", "Pinyin": "puyang"}, {
            "Id": 157,
            "Name": "平顶山",
            "Pinyin": "pingdingshan"
        }]
    },
        {
        "FirstLetter": "Q",
        "MatchCitys": [{"Id": 292, "Name": "青岛", "Pinyin": "qingdao"}, {
            "Id": 3191,
            "Name": "清迈",
            "Pinyin": "QINGMAI"
        }, {"Id": 131, "Name": "琼海", "Pinyin": "qionghai"}, {"Id": 377, "Name": "曲靖", "Pinyin": "qujing"}, {
            "Id": 117,
            "Name": "黔南布依族苗族自治州",
            "Pinyin": "QianNanBuYiZuMiaoZuZiZhiZhou"
        }, {"Id": 176, "Name": "七台河", "Pinyin": "qitaihe"}, {
            "Id": 118,
            "Name": "黔西南布依族苗族自治州",
            "Pinyin": "QianXiNanBuYiZuMiaoZuZiZhiZhou"
        }, {"Id": 177, "Name": "齐齐哈尔", "Pinyin": "qiqihaer"}, {
            "Id": 187,
            "Name": "潜江",
            "Pinyin": "qianjiang"
        }, {"Id": 73, "Name": "庆阳", "Pinyin": "qingyang"}, {"Id": 87, "Name": "清远", "Pinyin": "qingyuan"}, {
            "Id": 393,
            "Name": "衢州",
            "Pinyin": "quzhou"
        }, {"Id": 132, "Name": "琼中黎族苗族自治县", "Pinyin": "QiongZhongLiZuMiaoZuZiZhiXian"}, {
            "Id": 145,
            "Name": "秦皇岛",
            "Pinyin": "qinhuangdao"
        }, {"Id": 116, "Name": "黔东南苗族侗族自治州", "Pinyin": "QianDongNanMiaoZuDongZuZiZhiZhou"}, {
            "Id": 109,
            "Name": "钦州",
            "Pinyin": "qinzhou"
        }, {"Id": 59, "Name": "泉州", "Pinyin": "quanzhou"}]
    },
        {
        "FirstLetter": "R",
        "MatchCitys": [{"Id": 4337, "Name": "日内瓦", "Pinyin": "RINEIWA"}, {
            "Id": 293,
            "Name": "日照",
            "Pinyin": "rizhao"
        }, {"Id": 349, "Name": "日喀则", "Pinyin": "rikaze"}]
    },
        {
        "FirstLetter": "S",
        "MatchCitys": [{"Id": 321, "Name": "上海", "Pinyin": "shanghai"}, {
            "Id": 91,
            "Name": "深圳",
            "Pinyin": "shenzhen"
        }, {"Id": 256, "Name": "沈阳", "Pinyin": "shenyang"}, {"Id": 226, "Name": "苏州", "Pinyin": "suzhou"}, {
            "Id": 389,
            "Name": "绍兴",
            "Pinyin": "shaoxing"
        }, {"Id": 60, "Name": "三明", "Pinyin": "sanming"}, {
            "Id": 178,
            "Name": "双鸭山",
            "Pinyin": "shuangyashan"
        }, {"Id": 4254, "Name": "圣地牙哥", "Pinyin": "SHENGDIYAGE"}, {
            "Id": 4250,
            "Name": "塞班岛",
            "Pinyin": "SAIBANDAO"
        }, {"Id": 159, "Name": "商丘", "Pinyin": "shangqiu"}, {"Id": 48, "Name": "宿州", "Pinyin": "suzhoushi"}, {
            "Id": 158,
            "Name": "三门峡",
            "Pinyin": "sanmenxia"
        }, {"Id": 218, "Name": "松原", "Pinyin": "songyuan"}, {"Id": 337, "Name": "遂宁", "Pinyin": "SuiNing"}, {
            "Id": 89,
            "Name": "汕尾",
            "Pinyin": "shanwei"
        }, {"Id": 188, "Name": "神农架林区", "Pinyin": "ShenNongJiaLinQu"}, {
            "Id": 306,
            "Name": "朔州",
            "Pinyin": "shuozhou"
        }, {"Id": 6321, "Name": "三沙市", "Pinyin": "SANSHASHI"}, {
            "Id": 241,
            "Name": "上饶",
            "Pinyin": "shangrao"
        }, {"Id": 314, "Name": "商洛", "Pinyin": "shangluo"}, {
            "Id": 5467,
            "Name": "萨克拉门托",
            "Pinyin": "SAKELAMENTUO"
        }, {"Id": 90, "Name": "韶关", "Pinyin": "shaoguan"}, {"Id": 217, "Name": "四平", "Pinyin": "siping"}, {
            "Id": 350,
            "Name": "山南",
            "Pinyin": "shannan"
        }, {"Id": 190, "Name": "随州", "Pinyin": "suizhou"}, {"Id": 179, "Name": "绥化", "Pinyin": "SuiHua"}, {
            "Id": 227,
            "Name": "宿迁",
            "Pinyin": "suqian"
        }, {"Id": 361, "Name": "石河子", "Pinyin": "shihezi"}, {
            "Id": 15888,
            "Name": "圣塔芭芭拉",
            "Pinyin": "ShengTaBaBaLa"
        }, {"Id": 204, "Name": "邵阳", "Pinyin": "shaoyang"}, {
            "Id": 5470,
            "Name": "圣巴巴拉",
            "Pinyin": "SHENGBABALA"
        }, {"Id": 189, "Name": "十堰", "Pinyin": "shiyan"}, {"Id": 272, "Name": "石嘴山", "Pinyin": "shizuishan"}, {
            "Id": 88,
            "Name": "汕头",
            "Pinyin": "shantou"
        }, {"Id": 133, "Name": "三亚", "Pinyin": "sanya"}, {"Id": 146, "Name": "石家庄", "Pinyin": "shijiazhuang"}]
    },
        {
        "FirstLetter": "T",
        "MatchCitys": [{"Id": 343, "Name": "天津", "Pinyin": "tianjin"}, {
            "Id": 228,
            "Name": "泰州",
            "Pinyin": "TaiZhou"
        }, {"Id": 390, "Name": "台州", "Pinyin": "taizhou"}, {"Id": 3113, "Name": "塔城", "Pinyin": "tacheng"}, {
            "Id": 134,
            "Name": "屯昌县",
            "Pinyin": "TunChangXian"
        }, {"Id": 401, "Name": "台北", "Pinyin": "TaiBei"}, {
            "Id": 4251,
            "Name": "天宁岛",
            "Pinyin": "TIANNINGDAO"
        }, {"Id": 404, "Name": "台中", "Pinyin": "taizhong"}, {"Id": 294, "Name": "泰安", "Pinyin": "taian"}, {
            "Id": 6376,
            "Name": "坦帕",
            "Pinyin": "TANPA"
        }, {"Id": 5116, "Name": "桃园", "Pinyin": "taoyuan"}, {
            "Id": 315,
            "Name": "铜川",
            "Pinyin": "tongchuan"
        }, {"Id": 257, "Name": "铁岭", "Pinyin": "tieling"}, {"Id": 119, "Name": "铜仁", "Pinyin": "tongren"}, {
            "Id": 362,
            "Name": "图木舒克",
            "Pinyin": "tumushuke"
        }, {"Id": 49, "Name": "铜陵", "Pinyin": "tongling"}, {"Id": 219, "Name": "通化", "Pinyin": "tonghua"}, {
            "Id": 402,
            "Name": "台东",
            "Pinyin": "taidong"
        }, {"Id": 74, "Name": "天水", "Pinyin": "tianshui"}, {"Id": 403, "Name": "台南", "Pinyin": "tainan"}, {
            "Id": 266,
            "Name": "通辽",
            "Pinyin": "tongliao"
        }, {"Id": 147, "Name": "唐山", "Pinyin": "tangshan"}, {
            "Id": 363,
            "Name": "吐鲁番",
            "Pinyin": "tulufan"
        }, {"Id": 4445, "Name": "陶波", "Pinyin": "TAOBO"}, {"Id": 191, "Name": "天门", "Pinyin": "tianmen"}, {
            "Id": 307,
            "Name": "太原",
            "Pinyin": "taiyuan"
        }]
    },
        {
        "FirstLetter": "W",
        "MatchCitys": [{"Id": 192, "Name": "武汉", "Pinyin": "wuhan"}, {
            "Id": 229,
            "Name": "无锡",
            "Pinyin": "wuxi"
        }, {"Id": 295, "Name": "威海", "Pinyin": "weihai"}, {"Id": 316, "Name": "渭南", "Pinyin": "weinan"}, {
            "Id": 135,
            "Name": "万宁",
            "Pinyin": "wanning"
        }, {"Id": 137, "Name": "五指山", "Pinyin": "wuzhishan"}, {
            "Id": 273,
            "Name": "吴忠",
            "Pinyin": "wuzhong"
        }, {"Id": 379, "Name": "文山壮族苗族自治州", "Pinyin": "WenShanZhuangZuMiaoZuZiZhiZhou"}, {
            "Id": 296,
            "Name": "潍坊",
            "Pinyin": "weifang"
        }, {"Id": 267, "Name": "乌海", "Pinyin": "wuhai"}, {
            "Id": 268,
            "Name": "乌兰察布市",
            "Pinyin": "WuLanChaBuShi"
        }, {"Id": 75, "Name": "武威", "Pinyin": "wuwei"}, {
            "Id": 5592,
            "Name": "威斯巴登",
            "Pinyin": "WEISIBADENG"
        }, {"Id": 4310, "Name": "维多利亚", "Pinyin": "WEIDUOLIYA"}, {
            "Id": 365,
            "Name": "五家渠",
            "Pinyin": "wujiaqu"
        }, {"Id": 110, "Name": "梧州", "Pinyin": "wuzhou"}, {
            "Id": 4311,
            "Name": "温哥华",
            "Pinyin": "WENGEHUA"
        }, {"Id": 4766, "Name": "伍伦贡", "Pinyin": "WULUNGONG"}, {
            "Id": 136,
            "Name": "文昌",
            "Pinyin": "wenchang"
        }, {"Id": 50, "Name": "芜湖", "Pinyin": "wuhu"}, {
            "Id": 3143,
            "Name": "乌苏里江",
            "Pinyin": "wusulijiang"
        }, {"Id": 364, "Name": "乌鲁木齐", "Pinyin": "wulumuqi"}, {"Id": 391, "Name": "温州", "Pinyin": "wenzhou"}]
    },
        {
        "FirstLetter": "X",
        "MatchCitys": [{"Id": 317, "Name": "西安", "Pinyin": "xian"}, {
            "Id": 61,
            "Name": "厦门",
            "Pinyin": "xiamen"
        }, {"Id": 194, "Name": "咸宁", "Pinyin": "xianning"}, {"Id": 162, "Name": "许昌", "Pinyin": "xuchang"}, {
            "Id": 6571,
            "Name": "新北",
            "Pinyin": "XinBei"
        }, {"Id": 4416, "Name": "悉尼", "Pinyin": "XINI"}, {"Id": 318, "Name": "咸阳", "Pinyin": "xianyang"}, {
            "Id": 160,
            "Name": "新乡",
            "Pinyin": "xinxiang"
        }, {"Id": 148, "Name": "邢台", "Pinyin": "xingtai"}, {
            "Id": 4580,
            "Name": "兴城",
            "Pinyin": "xingcheng"
        }, {"Id": 196, "Name": "孝感", "Pinyin": "xiaogan"}, {"Id": 161, "Name": "信阳", "Pinyin": "xinyang"}, {
            "Id": 380,
            "Name": "西双版纳傣族自治州",
            "Pinyin": "XiShuangBanNaDaiZuZiZhiZhou"
        }, {"Id": 193, "Name": "仙桃", "Pinyin": "xiantao"}, {
            "Id": 269,
            "Name": "锡林郭勒盟",
            "Pinyin": "XiLinGuoLeMeng"
        }, {"Id": 205, "Name": "湘潭", "Pinyin": "xiangtan"}, {"Id": 242, "Name": "新余", "Pinyin": "xinyu"}, {
            "Id": 281,
            "Name": "西宁",
            "Pinyin": "xining"
        }, {"Id": 5114, "Name": "新竹", "Pinyin": "xinzhu"}, {
            "Id": 206,
            "Name": "湘西土家族苗族自治州",
            "Pinyin": "XiangXiTuJiaZuMiaoZuZiZhiZhou"
        }, {"Id": 270, "Name": "兴安盟", "Pinyin": "xinganmeng"}, {
            "Id": 308,
            "Name": "忻州",
            "Pinyin": "xinzhou"
        }, {"Id": 6858, "Name": "岘港", "Pinyin": "XianGang"}, {
            "Id": 195,
            "Name": "襄阳",
            "Pinyin": "xiangyang"
        }, {"Id": 51, "Name": "宣城", "Pinyin": "xuancheng"}, {"Id": 230, "Name": "徐州", "Pinyin": "xuzhou"}, {
            "Id": 395,
            "Name": "香港",
            "Pinyin": "XiangGang"
        }]
    },
        {
        "FirstLetter": "Y",
        "MatchCitys": [{"Id": 366, "Name": "伊犁哈萨克自治州", "Pinyin": "YiLiHaSaKeZiZhiZhou"}, {
            "Id": 209,
            "Name": "岳阳",
            "Pinyin": "yueyang"
        }, {"Id": 197, "Name": "宜昌", "Pinyin": "yichang"}, {"Id": 258, "Name": "营口", "Pinyin": "yingkou"}, {
            "Id": 93,
            "Name": "云浮",
            "Pinyin": "yunfu"
        }, {"Id": 5120, "Name": "云林", "Pinyin": "yunlin"}, {"Id": 92, "Name": "阳江", "Pinyin": "yangjiang"}, {
            "Id": 381,
            "Name": "玉溪",
            "Pinyin": "yuxi"
        }, {"Id": 339, "Name": "宜宾", "Pinyin": "yibin"}, {"Id": 180, "Name": "伊春", "Pinyin": "yichun"}, {
            "Id": 319,
            "Name": "延安",
            "Pinyin": "yanan"
        }, {"Id": 274, "Name": "银川", "Pinyin": "yinchuan"}, {"Id": 208, "Name": "永州", "Pinyin": "yongzhou"}, {
            "Id": 111,
            "Name": "玉林",
            "Pinyin": "yulin"
        }, {"Id": 309, "Name": "阳泉", "Pinyin": "yangquan"}, {
            "Id": 282,
            "Name": "玉树藏族自治州",
            "Pinyin": "YuShuZangZuZiZhiZhou"
        }, {"Id": 243, "Name": "宜春", "Pinyin": "YiChun"}, {"Id": 338, "Name": "雅安", "Pinyin": "yaan"}, {
            "Id": 5115,
            "Name": "宜兰",
            "Pinyin": "yilan"
        }, {"Id": 244, "Name": "鹰潭", "Pinyin": "yingtan"}, {"Id": 207, "Name": "益阳", "Pinyin": "yiyang"}, {
            "Id": 320,
            "Name": "榆林",
            "Pinyin": "YuLin"
        }, {"Id": 220, "Name": "延边朝鲜族自治州", "Pinyin": "YanBianChaoXianZuZiZhiZhou"}, {
            "Id": 310,
            "Name": "运城",
            "Pinyin": "yuncheng"
        }, {"Id": 232, "Name": "扬州", "Pinyin": "yangzhou"}, {"Id": 231, "Name": "盐城", "Pinyin": "yancheng"}, {
            "Id": 297,
            "Name": "烟台",
            "Pinyin": "yantai"
        }]
    },
        {
        "FirstLetter": "Z",
        "MatchCitys": [{"Id": 233, "Name": "镇江", "Pinyin": "zhenjiang"}, {
            "Id": 392,
            "Name": "舟山",
            "Pinyin": "zhoushan"
        }, {"Id": 3105, "Name": "中卫", "Pinyin": "zhongwei"}, {
            "Id": 95,
            "Name": "肇庆",
            "Pinyin": "zhaoqing"
        }, {"Id": 5118, "Name": "彰化", "Pinyin": "zhanghua"}, {"Id": 340, "Name": "资阳", "Pinyin": "ziyang"}, {
            "Id": 62,
            "Name": "漳州",
            "Pinyin": "zhangzhou"
        }, {"Id": 211, "Name": "株洲", "Pinyin": "zhuzhou"}, {
            "Id": 149,
            "Name": "张家口",
            "Pinyin": "zhangjiakou"
        }, {"Id": 341, "Name": "自贡", "Pinyin": "zigong"}, {"Id": 96, "Name": "中山", "Pinyin": "zhongshan"}, {
            "Id": 210,
            "Name": "张家界",
            "Pinyin": "zhangjiajie"
        }, {"Id": 382, "Name": "昭通", "Pinyin": "zhaotong"}, {"Id": 298, "Name": "枣庄", "Pinyin": "zaozhuang"}, {
            "Id": 76,
            "Name": "张掖",
            "Pinyin": "zhangye"
        }, {"Id": 94, "Name": "湛江", "Pinyin": "zhanjiang"}, {
            "Id": 5504,
            "Name": "棕榈泉",
            "Pinyin": "ZONGLUQUAN"
        }, {"Id": 120, "Name": "遵义", "Pinyin": "zunyi"}, {"Id": 4258, "Name": "芝加哥", "Pinyin": "ZHIJIAGE"}, {
            "Id": 299,
            "Name": "淄博",
            "Pinyin": "zibo"
        }, {"Id": 165, "Name": "驻马店", "Pinyin": "zhumadian"}, {"Id": 164, "Name": "周口", "Pinyin": "zhoukou"}, {
            "Id": 97,
            "Name": "珠海",
            "Pinyin": "zhuhai"
        }, {"Id": 163, "Name": "郑州", "Pinyin": "zhengzhou"}]
    }],
        hotStartList: [{"Id": 321, "Name": "上海", "Pinyin": "shanghai"},
        {
        "Id": 53,
        "Name": "北京",
        "Pinyin": "beijing"
    }, {"Id": 383, "Name": "杭州", "Pinyin": "hangzhou"}, {"Id": 80, "Name": "广州", "Pinyin": "guangzhou"}, {
        "Id": 224,
        "Name": "南京",
        "Pinyin": "nanjing"
    }, {"Id": 91, "Name": "深圳", "Pinyin": "shenzhen"}, {"Id": 324, "Name": "成都", "Pinyin": "chengdu"}, {
        "Id": 192,
        "Name": "武汉",
        "Pinyin": "wuhan"
    }, {"Id": 343, "Name": "天津", "Pinyin": "tianjin"}, {"Id": 394, "Name": "重庆", "Pinyin": "ChongQing"}, {
        "Id": 256,
        "Name": "沈阳",
        "Pinyin": "shenyang"
    }, {"Id": 226, "Name": "苏州", "Pinyin": "suzhou"}, {"Id": 317, "Name": "西安", "Pinyin": "xian"}, {
        "Id": 292,
        "Name": "青岛",
        "Pinyin": "qingdao"
    }, {"Id": 199, "Name": "长沙", "Pinyin": "changsha"}, {"Id": 221, "Name": "常州", "Pinyin": "changzhou"}, {
        "Id": 388,
        "Name": "宁波",
        "Pinyin": "ningbo"
    }, {"Id": 229, "Name": "无锡", "Pinyin": "wuxi"}, {"Id": 61, "Name": "厦门", "Pinyin": "xiamen"}, {
        "Id": 42,
        "Name": "合肥",
        "Pinyin": "hefei"
    }, {"Id": 287, "Name": "济南", "Pinyin": "jinan"}, {"Id": 239, "Name": "南昌", "Pinyin": "nanchang"}, {
        "Id": 54,
        "Name": "福州",
        "Pinyin": "fuzhou"
    }, {"Id": 391, "Name": "温州", "Pinyin": "wenzhou"}]
}
