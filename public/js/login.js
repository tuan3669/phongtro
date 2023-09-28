// sử dụng jquery xử lí login jwt

$(document).ready(function () {
  $('#login-form').submit(function (e) {
    e.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();
    $.ajax({
      url: '/signin',
      type: 'POST',
      data: {
        email,
        password,
      },
      success: function (result) {
        if (result) {
          // tôi sẽ lưu token và user vào session storage
          sessionStorage.setItem('token', result.token);
          sessionStorage.setItem('user', JSON.stringify(result.others));
          window.location.href = '/';
          $('.toast-body').text(result.message);
          $('.toast').addClass('bg-success');
          $('.toast').toast('show');
        }
      },
      error: function (err) {
        console.log(err);
        // hiển thị thông báo toast
        $('.toast-body').text(err.responseJSON.message);
        $('.toast').addClass('bg-danger');
        $('.toast').toast('show');
        // hide toast
        setTimeout(function () {
          $('.toast').removeClass('bg-danger');
          $('.toast').toast('hide');
        }, 3000);
      },
    });
  });
});

// logout
$(document).ready(function () {
  $('#logout').click(function (e) {
    e.preventDefault();
    $.ajax({
      url: '/logout',
      type: 'POST',
      success: function (result) {
        if (result) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          window.location.href = '/';
        } else {
          alert(result.message);
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
});
