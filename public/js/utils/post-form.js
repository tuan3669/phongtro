import locationApi from '../api/locationApi.js';
import categoryApi from '../api/categoryApi.js';
import userApi from '../api/userApi.js';
import { initOnchangeLocation, setAddressValue } from '../province.js';
import { getFileUpload } from './selector.js';
import { formartPriceNumber } from './common.js';
export async function validationPostForm(form, formValues) {
  // reset validation fileds
  [
    'houseNumber',
    'address',
    'ward',
    'acreage',
    'title',
    'province',
    'category',
    'description',
    'district',
    'file',
    'price',
  ].forEach((name) => {
    setFieldError(form, name, '');
  });

  try {
    formValues['isUpload'] =
      formValues.file[0].name !== '' || formValues.images == '' ? true : false;
    const postSchema = getPostSchema();

    await postSchema.validateAsync(formValues);
    // await postSchema.validateAsync(formValues);
  } catch (error) {
    for (const field of error.details) {
      console.log('message error ::', field.message);
      setFieldError(form, field.path, field.message);
    }
    console.log(error);
  }

  const isVaild = form.checkValidity();
  form.classList.add('was-validated');
  console.log('valid ::', isVaild);
  return isVaild;
}
export function getPostSchema() {
  const { MB3 } = {
    MB3: 3 * 1024 * 1024,
  };

  const postSchema = joi
    .object({
      province: joi.string().min(1),
      ward: joi.string().min(1),
      district: joi.string().min(1),
      acreage: joi.string().min(2).max(3),
      price: joi.string().min(4),
      houseNumber: joi.string().min(4),
      category: joi.string().min(10),
      title: joi.string().min(7),
      description: joi.string().min(100),
      isUpload: joi.boolean(),
      file: joi.any().when('isUpload', {
        is: true,
        then: joi
          .custom((file, helpers) => {
            for (const f of file) {
              if (f.size > MB3) {
                return helpers.error('any.maxSize');
              }
              if (f?.size <= 0) return helpers.error('any.invalid');
            }
            return file;
          }, 'image validation')
          .message({
            'any.invalid': 'Vui lòng chọn ảnh',
            'any.maxSize': 'Ảnh tối đa 3mb',
          }),
        otherwise: joi.any(),
      }),
    })
    .options({ abortEarly: false, allowUnknown: true });
  return postSchema;
}
export function setFieldError(form, name, error) {
  const filed = form.querySelector(`[name="${name}"]`);
  if (!filed) return;

  filed.setCustomValidity(error);
  const formGroup = filed.closest('.form-group');
  const errorElement = formGroup.querySelector('.invalid-feedback');
  if (!errorElement) return;

  errorElement.textContent = error;
}

export function getFormValues(form) {
  let defaultFormValues = {};
  // defaultFormValues['file'] = file.files;
  defaultFormValues['file'] = [];
  const formData = new FormData(form);
  for (const [key, value] of formData) {
    if (typeof value === 'object') {
      defaultFormValues['file'].push(value);
    } else {
      defaultFormValues[key] = value;
    }
  }

  return defaultFormValues;
}

export function initUploadImage(form) {
  let inputFiles = getFileUpload(form);
  if (!inputFiles) return;
  const imageContainer = document.getElementById('image-list');

  inputFiles.addEventListener('change', ({ target }) => {
    imageContainer.innerHTML = '';

    const fileList = target.files;
    validateFormField(
      form,
      {
        ['file']: fileList,
        ['isUpload']: true,
      },
      'file'
    );

    for (const [index, file] of Object.entries(fileList)) {
      const imageURL = URL.createObjectURL(file);
      const imgElment = document.createElement('img');
      imgElment.classList.add('img-fuild');
      imgElment.src = imageURL;
      imgElment.dataset.index = index;
      imageContainer.appendChild(imgElment);
    }
  });

  imageContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      const imgElement = e.target;
      imgElement.remove();
      // get all files
      const fileList = inputFiles.files;

      // convert to array
      const uploadFiles = [...fileList];
      const index = parseInt(imgElement.dataset.index);
      console.log('index: ' + index);

      uploadFiles.splice(index, 1);

      const remainingImages = imageContainer.querySelectorAll('img');
      remainingImages.forEach((img, i) => {
        if (i >= index) {
          img.dataset.index = i;
        }
      });

      //  convert elements sang  DOM
      const dataTransfer = new DataTransfer();
      uploadFiles.forEach((file) => {
        dataTransfer.items.add(file);
      });

      // add file
      const newFileList = dataTransfer.files;
      inputFiles.value = null;
      inputFiles.files = newFileList;
    }
  });
}
export async function validateFormField(form, formValues, name) {
  // reset filed errors
  setFieldError(form, name, '');
  const field = form.querySelector(`[name="${name}"]`);

  if (!field) return;
  try {
    const postSchema = getPostSchema();

    await postSchema.validateAsync(formValues);
  } catch (error) {
    const errorMessage = error.details[0].message;
    setFieldError(form, name, errorMessage);
  }
  const formGroup = field.closest('.form-group');
  formGroup.classList.add('was-validated');
}

export function initFieldOnchange(form) {
  // reset error empty
  const fields = [
    'province',
    'ward',
    'district',
    'acreage',
    'price',
    'houseNumber',
    'address',
    'category',
    'title',
    'description',
  ];
  fields.forEach((name) => {
    setFieldError(form, name, '');
  });

  initOnchangeLocation(form);

  ['acreage', 'price', 'houseNumber', 'category', 'title', 'description'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;
    if (name === 'category') {
      field.addEventListener('change', (e) => {
        const data = e.target.value;
        validateFormField(
          form,
          {
            [name]: data,
          },
          name
        );
      });
    } else {
      field.addEventListener('input', (e) => {
        const data = e.target.value;
        if (name === 'price' && data) {
          field.value = formartPriceNumber(data);
        }
        if (name === 'houseNumber') {
          setAddressValue(form, data);
        }
        validateFormField(
          form,
          {
            [name]: data,
          },
          name
        );
      });
    }
  });
}

export async function renderCategories(form, seletedId) {
  if (!form) return;

  const selectBoxElement = form.querySelector('select[name="category"]');
  if (!selectBoxElement) return;
  const { data } = await categoryApi.getAll();
  data.forEach((category) => {
    const optionElement = document.createElement('option');
    optionElement.value = category._id;
    optionElement.textContent = category.title;
    if (seletedId && seletedId === category._id) optionElement.selected = true;
    selectBoxElement.appendChild(optionElement);
  });
}

export function showLoading(form) {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
}
export function hideLoading(form) {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = false;
  button.innerHTML = `<i class="fas fa-save me-2"></i>Save`;
}

function setFormValues(form, defaultFormValues) {
  if (!form) return;
  if (defaultFormValues._id) {
    setLocation(form, defaultFormValues);
    const imageContainer = form.querySelector('#image-list');
    const images = defaultFormValues.images;

    images.forEach((imageURL, index) => {
      const imgElment = document.createElement('img');
      imgElment.classList.add('img-fuild');
      imgElment.src = imageURL;
      imgElment.dataset.index = index;
      imageContainer.appendChild(imgElment);
    });
  }

  const categoryId = defaultFormValues.category_id;
  renderCategories(form, categoryId);

  const title = form.querySelector('[name="title"]');
  if (!title) return;
  title.value = defaultFormValues.title;

  const description = form.querySelector('[name="description"]');
  if (!description) return;
  description.value = defaultFormValues.description;

  const price = form.querySelector('[name="price"]');
  if (!price) return;
  price.value = defaultFormValues.price;

  const acreage = form.querySelector('[name="acreage"]');
  if (!acreage) return;
  acreage.value = defaultFormValues.acreage;

  const addressElement = form.querySelector('[name="address"]');

  addressElement.value = defaultFormValues.address;
}

function setFiledLocation(locationValue, form, name, curentValue, codeName) {
  const locationElement = form.querySelector(`[name="${name}"]`);
  const options = locationElement.getElementsByTagName('option');
  [...options].some((element) => {
    if (element.text === curentValue) {
      locationValue[codeName] = element.value;
      element.selected = true;
      return true;
    }
  });
}

async function setLocation(form, defaultFormValues) {
  const { address } = defaultFormValues;
  const format = address.split(', ');
  const houseNumber = format[0];
  const ward = format[1];
  const district = format[2];
  const province = format[3];

  let locationValue = {};

  const houseNumberElement = form.querySelector('[name="houseNumber"]');
  houseNumberElement.value = houseNumber;
  // active province
  setFiledLocation(locationValue, form, 'province', province, 'provinceCode');

  // active district
  const districtValue = await locationApi.getDistrict(locationValue.provinceCode);
  renderOptions(districtValue.districts, 'district', form);
  setFiledLocation(locationValue, form, 'district', district, 'districtCode');

  // active ward
  const wardValue = await locationApi.getWard(locationValue.districtCode);
  renderOptions(wardValue.wards, 'ward', form);
  setFiledLocation(locationValue, form, 'ward', ward, 'wardCode');
}

export async function initPostForm({ formId, defaultFormValues, onSubmit }) {
  const form = document.getElementById(formId);
  let submit = false;

  const province = await locationApi.getProvince();
  renderOptions(province, 'province', form);
  setFormValues(form, defaultFormValues);
  const user = await getUserInfo(form);
  initUploadImage(form);
  initFieldOnchange(form);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submit) return;

    showLoading(form);
    submit = true;
    const formValues = getFormValues(form);
    if (defaultFormValues?._id) formValues.id = defaultFormValues?._id;

    formValues.images = defaultFormValues?.images;
    const isVaild = await validationPostForm(form, formValues);
    if (isVaild) {
      formValues.phone = user.phone;
      await onSubmit?.(formValues);
    }
    setTimeout(() => {
      hideLoading(form);
    }, 4000);
    submit = false;
  });
}

export async function getUserInfo(form) {
  // reset filed
  try {
    const userName = form.querySelector(`[name="username"]`);
    const phone = form.querySelector(`[name="phone"]`);
    if (!userName || !phone) return;
    const { user } = await userApi.getCurentUser();
    userName.value = user.username;
    phone.value = user.phone;
    return user;
  } catch (error) {
    console.log(error);
  }
}

export function renderOptions(data, name, form) {
  const select = form.querySelector(`[name="${name}"]`);
  // reset filed
  select.innerHTML = '';

  const option = document.createElement('option');
  switch (name) {
    case 'province':
      option.value = '';
      option.textContent = 'Chọn tỉnh thành phố';
      break;
    case 'district':
      option.value = '';
      option.textContent = 'Chọn tỉnh quận huyện';
      break;
    default:
      option.value = '';
      option.textContent = 'Chọn phường xã';
      break;
  }
  select.appendChild(option);
  data.forEach((d, index) => {
    // reset value
    const option = document.createElement('option');
    option.value = d.code;
    option.textContent = d.name;
    select.appendChild(option);
  });
}

export function clearOptions(name) {
  const select = document.querySelector(`[name="${name}"]`);

  // Lấy ra danh sách tất cả các options trong selectbox
  const options = select.getElementsByTagName('option');

  // Duyệt qua từng option, bắt đầu từ index 1 (tức là từ option thứ 2 trở đi)
  for (let i = 1; i < options.length; i++) {
    console.log(select.removeChild(options[i]));
  }
}
