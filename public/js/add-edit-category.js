import categoryApi from './api/categoryApi.js';
import { getFormValues, hideLoading, setFieldError, showLoading, toast } from './utils/index.js';

async function handleCategoryFormSubmit(formValues) {
  try {
    console.log('form values', formValues);
    const id = formValues?.id;
    const response = id ? await categoryApi.update(formValues) : await categoryApi.add(formValues);
    await toast.fire({
      icon: 'success',
      title: 'save category successfully',
    });
    setTimeout(() => {
      window.location.assign('https://puce-determined-raven.cyclic.app/categories');
    }, undefined);
  } catch (error) {
    await toast.fire({
      icon: 'error',
      title: 'save category failed',
    });
    console.error('error ::: ', error);
  }
}

function setFormValues(form, defaultFormValues) {
  if (!form) return;

  const title = form.querySelector('[name="title"]');
  if (!title) return;
  title.value = defaultFormValues.title;
}

function getCategorySchema() {
  const categorySchema = joi
    .object({
      title: joi.string().min(3).max(20),
    })
    .options({ abortEarly: false, allowUnknown: true });
  return categorySchema;
}

async function validateFormField(form, formValues, name) {
  // reset filed errors
  setFieldError(form, name, '');
  const field = form.querySelector(`[name="${name}"]`);

  if (!field) return;
  try {
    const categorySchema = getCategorySchema();

    await categorySchema.validateAsync(formValues);
  } catch (error) {
    const errorMessage = error.details[0].message;
    setFieldError(form, name, errorMessage);
  }
  const formGroup = field.closest('.form-group');
  formGroup.classList.add('was-validated');
}

function initFieldOnchange(form) {
  // reset error empty
  setFieldError(form, 'title', '');

  const field = form.querySelector(`[name="title"]`);
  if (!field) return;

  field.addEventListener('input', (e) => {
    const data = e.target.value;
    validateFormField(
      form,
      {
        ['title']: data,
      },
      'title'
    );
  });
}

async function validationCategoryForm(form, formValues) {
  // reset validation fileds
  setFieldError(form, 'title', '');

  try {
    const packageSchema = getCategorySchema();

    await packageSchema.validateAsync(formValues);
  } catch (error) {
    for (const field of error.details) {
      console.log('message error ::', field.message);
      setFieldError(form, field.path, field.message);
    }
  }

  const isVaild = form.checkValidity();
  form.classList.add('was-validated');
  return isVaild;
}

function initCategoryForm({ formId, defaultFormValues, onSubmit }) {
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

    const isVaild = await validationCategoryForm(form, formValues);
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
    ? await categoryApi.getById(id)
    : {
        title: '',
      };
  initCategoryForm({
    formId: 'categoryForm',
    defaultFormValues,
    onSubmit: async (value) => await handleCategoryFormSubmit(value),
  });
})();
