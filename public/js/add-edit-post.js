import postApi from './api/postApi.js';
import { initPostForm, toast, convertObjectToFormData } from './utils/index.js';

async function handlePostFormSubmit(formValues) {
  try {
    console.log('form values', formValues);
    const payLoad = convertObjectToFormData(formValues);
    const id = formValues?.id;
    console.log(id);
    const response = id
      ? await postApi.updatedFormData(payLoad)
      : await postApi.addFormData(payLoad);
    console.log(response);
    await toast.fire({
      icon: 'success',
      title: 'save post successfully',
    });
    setTimeout(() => {
      window.location.assign('https://puce-determined-raven.cyclic.app/posts');
    }, undefined);
  } catch (error) {
    await toast.fire({
      icon: 'error',
      title: 'save post failed',
    });
    console.error('error ::: ', error);
  }
}
(async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id');
  const defaultFormValues = id
    ? await postApi.getById(id)
    : {
        acreage: '',
        title: '',
        address: '',
        category: '',
        description: '',
        district: '',
        images: '',
        price: '',
      };

  console.log('post : ', defaultFormValues);
  initPostForm({
    formId: 'postForm',
    defaultFormValues,
    onSubmit: async (value) => await handlePostFormSubmit(value),
  });
})();
