import postApi from './api/postApi.js';
import categoryApi from './api/categoryApi.js';
import locationApi from './api/locationApi.js';
import { formatDate } from './utils/common.js';

function truncateText(text, length) {
  return text.length - 1 > length ? text.slice(0, length - 1) + '…' : text;
}

async function handelFilterChange(filterObjectValues) {
  // code

  // asdasdasd
  const queryPamrams = new URL(window.location);
  for (const [filterName, filterValue] of Object.entries(filterObjectValues)) {
    if (filterName) queryPamrams.searchParams.set(filterName, filterValue);

    if (filterName !== 'page') queryPamrams.searchParams.delete('page');
    if (filterName && filterValue == '') queryPamrams.searchParams.delete(filterName);
  }

  history.pushState({}, '', queryPamrams);
  const { data, pagination } = await postApi.getAllUserPosts(queryPamrams.searchParams);

  renderPostList({
    elemntId: 'postList',
    data,
  });

  const { pageActive, ulPagination, prevLiPagination, nextLiPagination } = renderPagination({
    elemntId: 'pagination',
    pagination,
  });

  handelClickPage({
    pageActive,
    ulPagination,
    prevLiPagination,
    nextLiPagination,
    onChange: (page) => {
      handelFilterChange({ ['page']: page });
    },
  });
}

function handelClickPage({
  pageActive,
  ulPagination,
  prevLiPagination,
  nextLiPagination,
  onChange,
}) {
  // get totalPage and curent page
  const totalPages = ulPagination.dataset.totalPages;
  const page = ulPagination.dataset.page;
  const prevPage = prevLiPagination.firstElementChild;
  const nextPage = nextLiPagination.firstElementChild;

  if (page <= 1) prevPage.classList.add('disabled');
  if (page >= totalPages) nextPage.classList.add('disabled');

  prevPage.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('prev click');
    const pageIndex = +page - 1;
    onChange?.(pageIndex);
  });
  nextPage.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('next click');

    const pageIndex = +page + 1;
    console.log('page index prev', pageIndex);
    onChange?.(pageIndex);
  });

  const pageNumbers = ulPagination.querySelectorAll('li.page-number');
  pageNumbers.forEach((pageNumber, index) => {
    pageNumber.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.target.closest('li');
      if (!page) return;

      pageActive.classList.remove('active');
      const pageIndex = +page.firstElementChild.textContent;
      page.classList.add('active');
      onChange?.(pageIndex);
    });
  });
}

function renderPagination({ elemntId, pagination }) {
  const ulPagination = document.getElementById(elemntId);
  if (!ulPagination) return;
  console.log('page pagination ', pagination);
  // reset page
  ulPagination.textContent = '';
  const prevLiPagination = document.createElement('li');
  prevLiPagination.classList.add('page-item');
  const prevPage = document.createElement('a');
  prevPage.innerHTML = '&laquo';
  prevPage.href = '';
  prevPage.classList.add('page-link');

  const nextLiPagination = document.createElement('li');
  nextLiPagination.classList.add('page-item');
  const nextPage = document.createElement('a');
  nextPage.href = '';
  nextPage.innerHTML = '&raquo';
  nextPage.classList.add('page-link');

  prevLiPagination.appendChild(prevPage);
  nextLiPagination.appendChild(nextPage);

  if (!prevLiPagination || !nextLiPagination) return;
  ulPagination.appendChild(prevLiPagination);
  ulPagination.appendChild(nextLiPagination);
  // save page
  ulPagination.dataset.totalPages = pagination.totalPages;
  ulPagination.dataset.page = pagination.page;

  const currentPage = pagination.page;
  let pageActive = null;
  for (let page = 1; page <= pagination.totalPages; page++) {
    const liPagination = document.createElement('li');
    liPagination.classList.add('page-item');
    liPagination.classList.add('page-number');

    const pageNumber = document.createElement('a');
    pageNumber.classList.add('page-link');
    pageNumber.href = '';
    pageNumber.textContent = page;
    liPagination.appendChild(pageNumber);

    // active page
    console.log('cureeent page ', currentPage);
    console.log(' page ', page);
    if (currentPage == page) {
      pageActive = liPagination;
      pageActive.classList.add('active');
    }
    ulPagination.insertBefore(liPagination, ulPagination.children[page]);
  }
  return {
    pageActive,
    ulPagination,
    prevLiPagination,
    nextLiPagination,
  };
}

function createPostElement(post, index) {
  const postTemplate = document.getElementById('postTemplate').cloneNode(true).content;
  const trElement = postTemplate.firstElementChild;
  let ordinalNumber = index + 1;
  if (!trElement || !post) return;

  const title = trElement.querySelector('[data-id="title"]');
  if (!title) return;
  title.textContent = post?.title;

  // const pack = trElement.querySelector('[data-id="pack"]');
  // if (!pack) return;
  // pack.textContent = post?.pack;

  const user = trElement.querySelector('[data-id="user"]');
  if (!user) return;
  user.textContent = post?.username;

  const category = trElement.querySelector('[data-id="category"]');
  if (!category) return;
  category.textContent = post?.categoryName;

  const vip = trElement.querySelector('[data-id="vip"]');
  if (!vip) return;
  vip.textContent = post?.isvip;

  const price = trElement.querySelector('[data-id="price"]');
  if (!price) return;
  price.textContent = new Intl.NumberFormat('en-DE').format(post?.price);

  const number = trElement.querySelector('[data-id="number"]');
  if (!number) return;
  number.textContent = ordinalNumber;

  const date = trElement.querySelector('[data-id="date"]');
  if (!date) return;
  date.textContent = formatDate(post.created_at);

  const buttons = trElement.querySelector('[data-id="action"]');
  if (!buttons) return;

  const image = trElement.querySelector('[data-id="image"]').firstElementChild;
  if (!image) return;
  image.src = post?.images[0];

  const removeButton = buttons.querySelector('#remove-btn');

  removeButton.addEventListener('click', () => {
    const trElement = removeButton.closest('tr');

    if (!trElement) return;
    let event = new CustomEvent('removePost', {
      bubbles: true,
      detail: { elemntId: trElement, id: post._id },
    });
    removeButton.dispatchEvent(event);
  });
  ordinalNumber++;
  return trElement;
}

function initRemovePost() {
  document.addEventListener('removePost', async (e) => {
    try {
      const trElement = e.detail.elemntId;
      Swal.fire({
        title: 'Bạn có chắc là xóa?',
        text: 'Nếu xóa thì bài viết sẽ biến mất hoàn toàn trong database!',
        icon: 'warning',
        showCancelButton: true,
        width: 600,
        height: 800,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log('id ', e.target.id);
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          trElement.remove();
          await postApi.removeById(e.detail.id);
          await toast.fire({
            icon: 'success',
            title: 'delete post successfully',
          });
          await handelFilterChange();
        }
      });
    } catch (error) {
      console.log(error);
      await toast.fire({
        icon: 'error',
        title: 'delete post failed',
      });
    }
  });
}

function renderPostList({ elemntId, data }) {
  const postList = document.getElementById(elemntId);
  if (!postList) return;
  postList.textContent = '';
  data.forEach((post, index) => {
    const trElement = createPostElement(post, index);
    postList.appendChild(trElement);
  });
}

function initPriceChange({ onChange }) {
  const slider = document.querySelector('#slider-price');
  const smoothStepsValues = document.querySelector('#smooth-steps-values-price');
  const priceButtonWrapper = document.getElementById('price-buttons');

  noUiSlider.create(slider, {
    start: [0, 15],
    step: 0.5,
    connect: true,
    range: {
      min: 0,
      max: 15,
    },
  });

  let count = 0;
  slider.noUiSlider.on('update', function (values) {
    if (count < 2) {
      count++;
      return;
    }
    const number1 = parseFloat(values[0]);
    const number2 = parseFloat(values[1]);
    const buttons = priceButtonWrapper.querySelectorAll('button');
    console.log('buttons price', buttons);
    for (const button of buttons)
      button.classList.toggle('active', `${number1}-${number2}` == button.value);
    smoothStepsValues.textContent = `Từ ${number1} - ${number2} triệu đồng`;
    onChange?.(slider.noUiSlider.get());
  });

  const buttons = priceButtonWrapper.querySelectorAll('button');
  // set value and get value
  priceButtonWrapper.addEventListener(
    'click',
    function (e) {
      if (e.target.tagName === 'BUTTON') {
        const value = e.target.value.split('-');
        slider.noUiSlider.set(value);
        onChange?.(slider.noUiSlider.get());
        for (const button of buttons) button.classList.toggle('active', e.target === button);
      }
    },
    {
      capture: true,
    }
  );
}
function initAcreageChange({ onChange }) {
  const slider = document.querySelector('#slider-acreage');
  const smoothStepsValues = document.querySelector('#smooth-steps-values-acreage');
  const acreageButtonWrapper = document.getElementById('acreage-buttons');

  noUiSlider.create(slider, {
    start: [0, 90],
    // behaviour: 'smooth-steps',
    step: 5,
    connect: true,
    range: {
      min: 0,
      max: 90,
    },
  });
  let count = 0;
  slider.noUiSlider.on('update', function (values) {
    if (count < 2) {
      count++;
      return;
    }
    const buttons = acreageButtonWrapper.querySelectorAll('button');

    const number1 = parseFloat(values[0]);
    const number2 = parseFloat(values[1]);
    smoothStepsValues.textContent = `Từ ${number1} - ${number2} m2`;
    onChange?.(slider.noUiSlider.get());
  });

  const buttons = acreageButtonWrapper.querySelectorAll('button');

  // set value and get value
  acreageButtonWrapper.addEventListener(
    'click',
    function (e) {
      if (e.target.tagName === 'BUTTON') {
        const value = e.target.value.split('-');
        slider.noUiSlider.set(value);
        // get value change
        onChange?.(slider.noUiSlider.get());
        for (const button of buttons) button.classList.toggle('active', e.target === button);

        // change thì gọi lại
      }
    },
    {
      capture: true,
    }
  );
}

// set lại values
function handelChangeAcreage(defaultValues, values) {
  defaultValues.minAcreage = values[0].split('.')[0];
  defaultValues.maxAcreage = values[1].split('.')[0];

  const button = document.getElementById('areageButton');
  if (defaultValues.minAcreage === defaultValues.maxAcreage) {
    defaultValues.maxAcreage = '';
    button.textContent = 'Trên ' + values[0].split('.')[0] + ' m2';
  } else {
    button.textContent = `Từ ${values[0].split('.')[0]} - ${values[1].split('.')[0]} m2`;
  }
}
function handelChangePrice(defaultValues, values) {
  // reset price
  const decimal1 =
    values[0].split('.')[1] !== '00' ? '.' + values[0].split('.')[1].split('')[0] + '0' : '0';
  const decimal2 =
    values[1].split('.')[1] !== '00' ? '.' + values[1].split('.')[1].split('')[0] + '0' : '0';
  console.log(decimal1);
  console.log(decimal2);
  const formatMinPrice = values[0].split('.')[0] + decimal1 + '00000';
  const formatMaxPrice = values[1].split('.')[0] + decimal2 + '00000';

  defaultValues.minPrice = formatMinPrice;
  defaultValues.maxPrice = formatMaxPrice;

  const button = document.getElementById('priceButton');
  if (defaultValues.minPrice === defaultValues.maxPrice) {
    defaultValues.maxPrice = '';
    button.textContent = 'Trên ' + values[0].split('.')[0] + ' triệu';
  } else {
    button.textContent = `Từ ${values[0].split('.')[0]}-${values[1].split('.')[0]} triệu`;
  }
}
function handelChangeAddress(defaultValues, address) {
  console.log('change');
  console.log('defuat value', defaultValues);
  const { province, district, ward } = address;
  console.log('address', address);
  if (province && province.dataset.code) {
    defaultValues.province = '';
    defaultValues.district = '';
    defaultValues.ward = '';
    defaultValues.province = province.innerText.trim().replaceAll(' ', '-');
  }

  if (district) {
    defaultValues.district = district.innerText.trim().replaceAll(' ', '-');
    defaultValues.ward = '';
  }
  if (ward) defaultValues.ward = ward.innerText.trim().replaceAll(' ', '-');

  if (province?.dataset?.code === '' && !district && !ward) {
    defaultValues.province = '';
    defaultValues.district = '';
    defaultValues.ward = '';
  }
  // change text content location button
  const locationButton = document.getElementById('locationButton');
  if (!defaultValues.province) {
    locationButton.textContent = 'Toàn Quốc';
  } else {
    let locationText = `${defaultValues.ward.replaceAll(
      '-',
      ' '
    )} ${defaultValues.district.replaceAll('-', ' ')} ${defaultValues.province.replaceAll(
      '-',
      ' '
    )}`;

    locationButton.textContent = truncateText(locationText, 26);
  }
}

function initAddressChange({ onChange }) {
  const ulPronvince = document.getElementById('province-wrapper');
  renderPronvinceList(ulPronvince);

  document.addEventListener('provinceItemActive', (e) => {
    onChange?.({ province: e.detail.province });
  });
  document.addEventListener('districtItemActive', (e) => {
    onChange?.({ district: e.detail.district });
  });
  document.addEventListener('wardItemActive', (e) => {
    onChange?.({ ward: e.detail.ward });
  });
}
function initCategoryChange({ onChange }) {
  const ulCategory = document.getElementById('category-list');
  renderCategoryList(ulCategory);

  document.addEventListener('categoryItemActive', (e) => {
    onChange?.(e.detail.id);
  });
}

async function renderCategoryList(ulCategory) {
  const { data } = await categoryApi.getAll();

  const item = {
    _id: '',
    title: 'Tất cả',
  };

  data.unshift(item);
  data.forEach((cate, index) => {
    const liElement = document.createElement('li');
    liElement.classList.add('p-2');
    liElement.dataset.id = cate._id;
    liElement.textContent = cate.title;
    if (index === 0) liElement.classList.add('active');

    liElement.addEventListener('click', (e) => {
      const categoryList = ulCategory.querySelectorAll('li');
      // reset acive
      [...categoryList].find((li) => li.closest('.active') && li.classList.remove('active'));
      const categoryButton = document.getElementById('categoryButton');
      categoryButton.textContent = liElement.textContent;
      liElement.classList.add('active');
      const modal = document.getElementById('category');
      const myModal = bootstrap.Modal.getInstance(modal);
      myModal.hide();

      // dispath event
      let event = new CustomEvent('categoryItemActive', {
        bubbles: true,
        detail: { id: liElement.dataset.id },
      });
      liElement.dispatchEvent(event);
    });
    ulCategory.appendChild(liElement);
  });
}

function createProvinceElement(data) {
  const provinceTemplate = document.getElementById('provinceTemplate').cloneNode(true).content;

  const liElement = provinceTemplate.firstElementChild;

  liElement.dataset.code = data.code;
  const labelElement = liElement.querySelector('label');
  const inputElement = liElement.querySelector('input');
  labelElement.textContent = data.name;

  liElement.addEventListener('click', (e) => {
    inputElement.checked = true;
    const provinceModal = new bootstrap.Modal('#exampleModalToggle2', {
      keyboard: false,
    });
    const modal = document.getElementById('exampleModalToggle');
    const myModal = bootstrap.Modal.getInstance(modal);
    myModal.hide();

    if (liElement.dataset.code) {
      provinceModal.show();
      renderDistrictList(liElement.dataset.code);
    }

    // dispath event
    let event = new CustomEvent('provinceItemActive', {
      bubbles: true,
      detail: { province: liElement },
    });
    liElement.dispatchEvent(event);
  });

  return liElement;
}
function createDistrictElement(data) {
  const districtTemplate = document.getElementById('districtTemplate').cloneNode(true).content;

  const liElement = districtTemplate.firstElementChild;
  liElement.dataset.code = data.code;
  const labelElement = liElement.querySelector('label');
  const inputElement = liElement.querySelector('input');
  labelElement.textContent = data.name;

  liElement.addEventListener('click', (e) => {
    inputElement.checked = true;

    const modal = document.getElementById('exampleModalToggle2');
    const myModal = bootstrap.Modal.getInstance(modal);
    myModal.hide();
    if (!liElement.dataset.code) return;

    const wardModal = new bootstrap.Modal('#exampleModalToggle3', {
      keyboard: false,
    });
    // dispath event
    let event = new CustomEvent('districtItemActive', {
      bubbles: true,
      detail: { district: liElement },
    });
    liElement.dispatchEvent(event);
    if (!liElement.dataset.code) return;

    wardModal.show();
    renderWardList(liElement.dataset.code);
  });
  return liElement;
}
function createWardElement(data) {
  const districtTemplate = document.getElementById('wardTemplate').cloneNode(true).content;

  const liElement = districtTemplate.firstElementChild;
  liElement.dataset.code = data.code;
  const labelElement = liElement.querySelector('label');
  const inputElement = liElement.querySelector('input');
  labelElement.textContent = data.name;

  liElement.addEventListener('click', (e) => {
    inputElement.checked = true;

    const modal = document.getElementById('exampleModalToggle3');
    const myModal = bootstrap.Modal.getInstance(modal);
    myModal.hide();
    if (!liElement.dataset.code) return;

    // dispath event
    let event = new CustomEvent('wardItemActive', {
      bubbles: true,
      detail: { ward: liElement },
    });
    liElement.dispatchEvent(event);
  });
  return liElement;
}

async function renderWardList(code) {
  const ulWard = document.getElementById('ward-wrapper');
  ulWard.innerHTML = '';
  const { wards } = await locationApi.getWard(code);
  const allwards = { name: 'Tất cả', code: '' };
  wards.unshift(allwards);
  wards.forEach((data) => {
    const liElement = createWardElement(data);
    ulWard.appendChild(liElement);
  });
}
async function renderDistrictList(code) {
  const ulDistrict = document.getElementById('district-wrapper');
  ulDistrict.innerHTML = '';
  const { districts } = await locationApi.getDistrict(code);
  const allDistricts = { name: 'Tất cả', code: '' };
  districts.unshift(allDistricts);
  districts.forEach((data) => {
    const liElement = createDistrictElement(data);
    ulDistrict.appendChild(liElement);
  });
}
async function renderPronvinceList(ulPronvince) {
  const province = await locationApi.getProvince();
  // push toàn quốc for pronvince
  const nationwide = { name: 'Toàn quốc', code: '' };
  province.unshift(nationwide);
  province.forEach((data) => {
    const liElement = createProvinceElement(data);
    ulPronvince.appendChild(liElement);
  });
}

function handelChangeCategory(defaultValues, value) {
  defaultValues.category = value;
  console.log(defaultValues);
}

// // Main
(async () => {
  try {
    const defaultValues = {
      province: '',
      district: '',
      ward: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minAcreage: '',
      maxAcreage: '',
    };
    // filter posts
    initCategoryChange({
      onChange: (value) => handelChangeCategory(defaultValues, value),
    });
    initAddressChange({
      onChange: (address) => {
        const { province = '', district = '', ward = '' } = address;

        handelChangeAddress(defaultValues, { province, district, ward });
      },
    });
    initAcreageChange({
      onChange: (value) => handelChangeAcreage(defaultValues, value),
    });
    initPriceChange({ onChange: (value) => handelChangePrice(defaultValues, value) });
    // filter posts

    initRemovePost();
    // call pai
    handelFilterChange({});

    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', (e) => {
      handelFilterChange(defaultValues);
    });
    // input ranger
  } catch (error) {
    console.log(error);
  }
})();
