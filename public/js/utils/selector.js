export function getFileUpload(form) {
  if (!form) return;
  const file = form.querySelector('[name="file"]');
  if (file) return file;
}
