;
(function(window, document, $, undefined) {
    $(document).ready(function() {
        $('.confirm-btn-chanal').on('click touchtap', function() {
            $('.dialog-confirm').fadeOut();
            history.go(-1);
        }, false);
        $('.confirm-btn-confirm').on('click touchtap', function() {
            $('.dialog-confirm').fadeOut();
        });
    })
})(window, window.document, jQuery)