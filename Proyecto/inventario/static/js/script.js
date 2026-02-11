$(document).ready(function () {
    // Variables de estado
    let $sidebar = $('.sidebar');
    let $wrapper = $('.main-wrapper');
    let $overlay = $('.sidebar-overlay');

    // Sidebar toggle
    $(document).on('click', '#toggle_btn', function () {
        if ($wrapper.hasClass('slide-nav')) {
            $wrapper.removeClass('slide-nav');
            $sidebar.removeClass('opened');
            $overlay.removeClass('opened');
        } else {
            $wrapper.addClass('slide-nav');
            $sidebar.addClass('opened');
            $overlay.addClass('opened');
        }
        return false;
    });

    // Mobile menu sidebar overlay
    $(document).on('click', '#mobile_btn', function () {
        $wrapper.toggleClass('slide-nav');
        $sidebar.toggleClass('opened');
        $overlay.toggleClass('opened');
        return false;
    });

    // Feather Icon
    if ($('[data-feather]').length > 0) {
        feather.replace();
    }

    // Slimscroll
    if ($('.slimscroll').length > 0) {
        $('.slimscroll').slimScroll({
            height: 'auto',
            width: '100%',
            position: 'right',
            size: '7px',
            color: '#ccc',
            wheelStep: 10,
            touchScrollStep: 100
        });
    }

    // Page Loader
    $(window).on('load', function () {
        $('#global-loader').fadeOut('slow');
    });

    // Tooltip
    if ($('[data-bs-toggle="tooltip"]').length > 0) {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    }
});