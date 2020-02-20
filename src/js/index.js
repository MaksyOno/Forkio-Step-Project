$('.menu-btn').on('click', function(e) {
    e.preventDefault;
    $(this).toggleClass('menu-btn_active');
    $('.nav-bar-nav').toggleClass('nav-bar-nav_active');
});