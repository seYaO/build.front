/**
 * validate
 */
(function ($) {

	var showVerifyTip = (function () {
		var $div = $('#verify-tip');

		var show = function (msg) {
			$div.html(msg).css('top', 0);

			setTimeout(function () {
				$div.html('').css('top', '-22px');
			}, 2500)
		}

		return {
			show: show
		}
	})();

	var validate = {
		reg: {
			name: /^[\u4E00-\u9FA5]{1,6}$/,
			identification: /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/,
			mobile: /^1[34578]\d{9}$/,
			guideNo: /^D-\d{4}-\d{6}$/,
			leaderNo: /^[\u4E00-\u9FA5]-[\d]{6}$/,
		},
		errmsgs: {
			name: '请输入您的真实姓名',
			identification: '请正确输入您的身份证号',
			mobile: '请正确输入您的手机号',
			guideNo: '请正确输入您的导游证号',
			leaderNo: '请正确输入您的领队证号'
		},
		do: function (type, content) {
			if (this.reg[type].test(content)) return '';

			return this.errmsgs[type];
		}
	}

	var getParam = function (name) {
	  var url = window.fakeUrl || window.location.href,
	  reg = new RegExp("[\?&]("+name+"=([^&#$]*))","i"),
	      rec1 = reg.exec(url);
	  if(rec1){
	      return rec1[2];
	  }else{
	      return "";
	  }
	}

	// 模态框隐藏
	$('.mask-close-btn').on('click touch', function (evt) {
		evt.stopPropagation();

		$(this).parents('.result-tip').hide();
	})


	// max date today
	var today = (function () {
		var today = new Date();
		var yyyy = today.getFullYear();
		var mm = today.getMonth()+1; //January is 0!
		if (mm < 10) {
			mm = '0' + mm;
		}

		today = yyyy + '-' + mm;

		$('#date').attr('max', today);

		return today;
	})()

	/*********************************************/

	$form = $('#form');

	$form.on('submit', function (evt) {
		evt.preventDefault();

		var errmsg = '';

		// verify userName
		var name = $('#userName').val().trim();

		errmsg = validate.do('name', name);

		if (!!errmsg) {
			return showVerifyTip.show(errmsg)
		}

		// verify gender
		var gender = $('input[name="gender"]:checked').val();
		if (!gender) {
			return showVerifyTip.show('请选择您的性别')
		}


		// verify identification  请正确输入您的身份证号
		var identification = $('#identification').val().trim();

		errmsg = validate.do('identification', identification);

		if (!!errmsg) {
			return showVerifyTip.show(errmsg)
		}

		// verify area 请选择所属区域
		var area = $('#area').val();

		if (area === '0') {
			showVerifyTip.show('请选择所属区域');

			return false;
		}

		// verify phoneNum 请正确输入您的手机号
		var mobile = $('#phoneNum').val();

		errmsg = validate.do('mobile', mobile);

		if (!!errmsg) {
			return showVerifyTip.show(errmsg)
		}

		// verify guideID  请正确输入您的导游证号
		var guideNo = $('#guide-card').val();

		errmsg = validate.do('guideNo', guideNo);

		if (!!errmsg) {
			return showVerifyTip.show(errmsg)
		}

		// verify firstleaddate
		var date = $('#date').val();
		
		if (!date) {
			return showVerifyTip.show('请填写您的带团起始时间')
		}

		if (date > today) {
			return showVerifyTip.show('请正确填写您的带团起始时间')
		}

		var data = {
			Name: name,
			Gender: gender,
			IdCardNo: identification,
			BelongAddress: area,
			Mobile: mobile,
			GuideNo: guideNo,
			LeaderNo: $('#leader-card').val(),
			FirstLeadDate: date,
			// AuthenticationToken: '',
			Source: 2,  // 0：未知，1：App，2：微信公众号
			OpenId: getParam('openid') || ''
		}

		console.log('params', data)

		$btn = $('#submitBtn');

		$.ajax({
			url: '/intervacation/api/JoinTC/Apply', // http://wx.t.17u.cn/intervacation/api/JoinTC/Apply
			type: 'post',
			data: data,
			beforeSend: function () {
				$btn.html('申请中...').attr('disabled', true);
			},
			success: function (response) {
				var res = response.Data.Response;
				console.log(res)
				/**
				 * ErrorCode 
				 * 0 => 成功
				 * 1 => 已存在
				 * 2 => 未通过
				 * 3 => 其他错误
				 */
				switch (res.ErrorCode) {
					case 0:
						$btn.html('申请成功').addClass('disabled');
						$('#result-tip-success').show();
						break;
					case 1: 
						$btn.html('申请成功').addClass('disabled');
						$('#result-tip-valid').show();
						break;
					default: 
						$btn.html('提交申请').removeAttr('disabled');
						$('#result-tip-error').show();
				}
			},
			error: function (err) {
				$btn.html('提交申请').removeAttr('disabled');
				$('#result-tip-catch').show();
			}
		});

	})
})(Zepto);