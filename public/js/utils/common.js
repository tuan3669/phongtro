export function formartPriceNumber(data) {
  const formartString = data.replace(/[^0-9]+/g, '');
  const number = parseInt(formartString);
  return number.toLocaleString('vi');
}

export function convertObjectToFormData(data) {
  const formData = new FormData();

  for (const key in data) {
    if (key === 'file') {
      const files = data[key];
      if (Array.isArray(files)) {
        for (const file of files) {
          formData.append(key, file);
        }
      } else {
        formData.append(key, files);
      }
    } else {
      formData.append(key, data[key]);
    }
  }
  if (data?.id) formData.append('id', data.id);
  return formData;
}

export function formatDate(time) {
  return dayjs(time).format('DD/MM/YYYY HH:mm:ss');
}
