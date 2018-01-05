function wxsharecnt(share){
    const sharecnt = share;
    const shareImg = sharecnt.shareImg ? sharecnt.shareImg :'http://file.40017.cn/baoxian/images/agb-mobile/share/aigobo-mobile-share.jpg';
    const shareTitle = sharecnt.shareTitle ? sharecnt.shareTitle :'旅行社每月多赚1万，只因这件事！';
    const shareUrl = sharecnt.shareUrl ? sharecnt.shareUrl : window.location.href;
    const shareDesc = sharecnt.shareDesc ? sharecnt.shareDesc :'旅游保险佣金高达50%、免结算、付款立减';
    document.getElementById('tcshareimg').value= shareImg; 
    document.getElementById('tcsharetext').value= shareTitle;
    document.getElementById('tcshareurl').value= shareUrl; 
    document.getElementById('tcDesc').value= shareDesc;
    sendMessage(); 
}

module.exports = {
    wxsharecnt
}