import packageApi from './api/packageApi.js';
import {
  formartPriceNumber,
  getFormValues,
  hideLoading,
  setFieldError,
  showLoading,
  toast,
} from './utils/index.js';

async function handlePackageFormSubmit(formValues) {
  try {
    console.log('form values', formValues);
    const id = formValues?.id;
    const response = id ? await packageApi.update(formValues) : await packageApi.add(formValues);
    console.log(response);
    await toast.fire({
      icon: 'success',
      title: 'save package successfully',
    });
    setTimeout(() => {
      window.location.assign('https://puce-determined-raven.cyclic.app/packages');
    }, undefined);
  } catch (error) {
    await toast.fire({
      icon: 'error',
      title: 'save package failed',
    });
    console.error('error ::: ', error);
  }
}

function setFormValues(form, defaultFormValues) {
  if (!form) return;

  const name = form.querySelector('[name="name"]');
  if (!name) return;
  name.value = defaultFormValues.name;

  const description = form.querySelector('[name="description"]');
  if (!description) return;
  description.value = defaultFormValues.description;

  const price = form.querySelector('[name="price"]');
  if (!price) return;
  price.value = defaultFormValues.price;

  const duration = form.querySelector('[name="duration"]');
  if (!duration) return;
  duration.value = defaultFormValues.duration;
}

function getPackageSchema() {
  const packageSchema = joi
    .object({
      duration: joi.string().min(1).max(2),
      price: joi.string().min(4),
      name: joi.string().min(3).max(20),
      description: joi.string().min(20),
    })
    .options({ abortEarly: false, allowUnknown: true });
  return packageSchema;
}

async function validateFormField(form, formValues, name) {
  // reset filed errors
  setFieldError(form, name, '');
  const field = form.querySelector(`[name="${name}"]`);

  if (!field) return;
  try {
    const packageSchema = getPackageSchema();

    await packageSchema.validateAsync(formValues);
  } catch (error) {
    const errorMessage = error.details[0].message;
    setFieldError(form, name, errorMessage);
  }
  const formGroup = field.closest('.form-group');
  formGroup.classList.add('was-validated');
}

function initFieldOnchange(form) {
  // reset error empty
  const fields = ['name', 'price', 'duration', 'description'];
  fields.forEach((name) => {
    setFieldError(form, name, '');
  });

  fields.forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;

    field.addEventListener('input', (e) => {
      const data = e.target.value;

      if (name === 'price' && data) {
        field.value = formartPriceNumber(data);
      }
      validateFormField(
        form,
        {
          [name]: data,
        },
        name
      );
    });
  });
}

async function validationPackageForm(form, formValues) {
  // reset validation fileds
  ['name', 'description', 'duration', 'price'].forEach((name) => {
    setFieldError(form, name, '');
  });

  try {
    const packageSchema = getPackageSchema();

    await packageSchema.validateAsync(formValues);
  } catch (error) {
    for (const field of error.details) {
      console.log('message error ::', field.message);
      setFieldError(form, field.path, field.message);
    }
    console.log(error);
  }

  const isVaild = form.checkValidity();
  form.classList.add('was-validated');
  return isVaild;
}

function initPackageForm({ formId, defaultFormValues, onSubmit }) {
  const form = document.getElementById(formId);
  let submit = false;
  setFormValues(form, defaultFormValues);
  initFieldOnchange(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submit) return;
    showLoading(form);
    submit = true;
    const formValues = getFormValues(form);
    if (defaultFormValues?._id) formValues.id = defaultFormValues?._id;

    const isVaild = await validationPackageForm(form, formValues);
    if (isVaild) {
      await onSubmit?.(formValues);
    }
    setTimeout(() => {
      hideLoading(form);
    }, 4000);
    submit = false;
  });
}
(async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id');
  const defaultFormValues = id
    ? await packageApi.getById(id)
    : {
        name: '',
        duration: '',
        description: '',
        price: '',
      };
  initPackageForm({
    formId: 'packageForm',
    defaultFormValues,
    onSubmit: async (value) => await handlePackageFormSubmit(value),
  });
})();
