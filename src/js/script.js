$( document ).ready( function() {
  $('.navigation__item').on('click', function() {
    $('.menu__input').prop('checked', false);
  });

  $('.tours__btn').on('click', function(event) {
    if ( $(window).width() >= 640) {
      event.preventDefault();
      $('.popup').addClass('popup--open');
    }
  });

  $('.popup__close').on('click', function() {
    $('.popup').removeClass('popup--open');
  });
}); 