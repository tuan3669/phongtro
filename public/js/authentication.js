import userApi from './api/userApi.js';

function setActiveLink() {
  const currentUrl = new URL(window.location).pathname.split('/')[1];
  // posts
  const menuLinks = document.querySelectorAll('#sidebar #navbar .nav-item');
  menuLinks.forEach((link) => {
    const currentLink = link.firstElementChild.href.slice(22).split('/')[0];
    if (currentLink === currentUrl) {
      link.firstElementChild.classList.add('fw-bold');
    } else {
      link.firstElementChild.classList.remove('fw-bold');
    }
  });
}

function renderPermisisonUserList({ sidebar, user }) {
  const navbarContainer = sidebar.querySelector('#navbar');
  const navbarTemplate = document.querySelector('#navbarTemplate').cloneNode(true).content;

  // render chung admin vs user
  // const navItemMyPosts = navbarTemplate.querySelector('#navItemMyPosts');
  // const navItemEditProfile = navbarTemplate.querySelector('#navItemEditProfile');
  // const navItemTopUp = navbarTemplate.querySelector('#navItemEditProfile');
  // const navItemTopUpHistory = navbarTemplate.querySelector('#navItemTopUpHistory');
  // const navItemPaymentHistory = navbarTemplate.querySelector('#navItemPaymentHistory');
  // const navItemPackageManagement = navbarTemplate.querySelector('#navItemPackageManagement');
  // const navItemStatistics = navbarTemplate.querySelector('#navItemStatistics');
  // const navItemPriceList = navbarTemplate.querySelector('#navItemPriceList');
  // const navItemLogout = navbarTemplate.querySelector('#navItemLogout');
  // const navItemContact = navbarTemplate.querySelector('#navItemContact');

  const basicRole = [
    'navItemMyPosts',
    'navItemEditProfile',
    'navItemTopUpHistory',
    'navItemPaymentHistory',
    'navItemPriceList',
    'navItemLogout',
    'navItemContact',
  ];

  const roleAdmin = [
    'navItemStatistics',
    'navItemPackageManagement',
    'navItemCategories',
    'navItemPostManagement',
    'navItemUserManagement',
  ];

  basicRole.forEach((elmentId) => {
    const element = navbarTemplate.querySelector(`#${elmentId}`);
    if (!element) return;
    navbarContainer.appendChild(element);
  });

  if (user.role === 'admin') {
    roleAdmin.forEach((elmentId) => {
      const element = navbarTemplate.querySelector(`#${elmentId}`);
      if (!element) return;
      navbarContainer.appendChild(element);
    });
  }

  // admin có thống kê
  // admin có thêm quản lí  all  post của tất cả user
  // admin có thêm quản lí  all user
  // admin có all dịch dịch hẹ thống
  // admin có thêm sửa xóa gói tin
  // ...
}

// /api/v1/auth
(async () => {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) window.location.assign('https://puce-determined-raven.cyclic.app/404');

    // check role
    // render sidebar menu theo Role
    const { user } = await userApi.getCurentUser();

    const sidebar = document.querySelector('#sidebar');

    renderPermisisonUserList({
      sidebar,
      user,
    });
    setActiveLink();
  } catch (error) {
    console.log('ko có token');
    window.location.assign('https://puce-determined-raven.cyclic.app/404');
  }
})();
