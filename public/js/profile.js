// get profile localhost:5000/api/v1/profile

// jquery

$(document).ready(function () {
  // get profile
  $.ajax({
    url: 'https://puce-determined-raven.cyclic.app/api/v1/profile',
    type: 'GET',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('token', `Bearer ${sessionStorage.getItem('token')}`);
    },
    success: function (result) {
      $('#name').val(result.username);
      $('#email').val(result.email);
      $('#phone').val(result.phone);

      $('#img-avatar').attr('src', result.avatar);
    },
    error: function (err) {
      console.log(err);
    },
  });
});

// update profile
$('#btn-update-profile').click(function (e) {
  e.preventDefault();
  const name = $('#name').val();
  const email = $('#email').val();
  const phone = $('#phone').val();
  const file = $('#file')[0].files[0];

  // Khởi tạo đối tượng FormData
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('file', file);

  $.ajax({
    url: 'https://puce-determined-raven.cyclic.app/api/v1/profile',
    type: 'PUT',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('token', `Bearer ${sessionStorage.getItem('token')}`);
    },
    data: formData, // Sử dụng đối tượng FormData
    processData: false,
    contentType: false,
    success: function (result) {
      $('#img-avatar').attr('src', result.avatar);
      alert(result.message);
    },
    error: function (err) {
      console.log(err);
    },
  });
});

// change password
$('#btn-change-password').click(function (e) {
  e.preventDefault();
  const oldPassword = $('#old-password').val();
  const newPassword = $('#new-password').val();
  $.ajax({
    url: 'https://puce-determined-raven.cyclic.app/api/v1/profile/change-password',
    type: 'PUT',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('token', `Bearer ${sessionStorage.getItem('token')}`);
    },
    data: {
      oldPassword,
      newPassword,
    },
    success: function (result) {
      console.log(result);
      if (result.message) {
        alert(result.message);
        // clear input
        $('#old-password').val('');
        $('#new-password').val('');
      }
    },
    error: function (err) {
      console.log(err);
      alert(err.responseJSON.message);
    },
  });
});
