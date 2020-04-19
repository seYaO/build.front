define("tab/0.2.0/index", function (require, exports, module) {
	
	(function ($) {
		$.fn.tab = function (control) {
			var $ele = $(this),
				$control = $(control),
				eventtype = $ele.data("event") || "click";
			// tab trigger
			$ele.on(eventtype, 'li', function (e) {
				e.preventDefault();
				var tabName = $(this).data('tab');
				$ele.trigger('change.tab', tabName);
			});

			$ele.on('change.tab', function (e, tabName) {
				$ele.find('li').removeClass('active');
				$ele.find('[data-tab="' + tabName + '"]').addClass('active');
			});

			$ele.on('change.tab', function (e, tabName) {
				$control.find('[data-tab]').removeClass('active');
				$control.find('[data-tab="' + tabName + '"]').addClass('active');
			});

			var firstName = $ele.find('li').eq(0).data('tab');
			$ele.trigger('change.tab', firstName);
		};
	})(window.jQuery)
});