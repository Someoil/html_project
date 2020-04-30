$(document).ready(function() {

  // svg для всех браузеров
  svg4everybody();
  // svg для всех браузеров


  // ОТПРАВКА формы
  $('.sendFormEvent').submit(function() {
    var th = $(this);
    $.ajax({
      type: 'POST',
      url: '/mail.php',
      data: th.serialize()
    }).done(function() {
      $.fancybox.close();
      $('.thanks').addClass('thanks_active');
      $(".darken").addClass("darken_active");
      setTimeout(function() {
        th.trigger('reset');
        $('.thanks').removeClass('thanks_active');
        $(".darken").removeClass("darken_active");
      }, 4000);
    });
    return false;
  });

  // burger
  $('body').on('click', '.burger', function() {
    $(this).toggleClass('active');
    $('.darken').toggleClass('darken_active');
    $('.headerNav').toggleClass('active');
  });
  $('.darken').click(function() {
    $('.darken').removeClass('darken_active');
    $('.headerNav').removeClass('active');
    $('.burger').removeClass('active');
  });
  // burger

});
window.onload = function() {
  $('.preloader').addClass('hidden');
  window.setTimeout(function() {
    $('body').removeClass('preload');
  }, 500);
}
