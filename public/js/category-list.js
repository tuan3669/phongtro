import categoryApi from './api/categoryApi.js';
import { formatDate } from './utils/common.js';

async function handelFilterChange(filterName, filterValue) {
  const queryPamrams = new URL(window.location);
  if (filterName) queryPamrams.searchParams.set(filterName, filterValue);
  history.pushState({}, '', queryPamrams);

  // call api
  const { data } = await categoryApi.getAll(queryPamrams.searchParams);
  console.log('data ', data);
  renderCategoryList({
    elemntId: 'categoryList',
    data,
  });
}

function createCategoryElement(cate, index) {
  const categoryTemplate = document.getElementById('categoryTemplate').cloneNode(true).content;
  const trElement = categoryTemplate.firstElementChild;
  let ordinalNumber = index + 1;
  if (!trElement || !cate) return;
  const title = trElement.querySelector('[data-id="title"]');
  if (!title) return;
  title.textContent = cate?.title;

  const number = trElement.querySelector('[data-id="number"]');
  if (!number) return;
  number.textContent = ordinalNumber;
  console.log('title ', title);
  const date = trElement.querySelector('[data-id="date"]');
  if (!date) return;
  date.textContent = formatDate(cate.created_at);

  const editButton = trElement.querySelector('#edit-btn');
  const removeButton = trElement.querySelector('#remove-btn');

  editButton.addEventListener('click', (e) => {
    window.location.assign(
      `https://puce-determined-raven.cyclic.app/categories/add-edit?id=${cate._id}`
    );
  });
  removeButton.addEventListener('click', () => {
    const trElement = removeButton.closest('tr');

    if (!trElement) return;
    let event = new CustomEvent('removeCategory', {
      bubbles: true,
      detail: { elemntId: trElement, id: cate._id },
    });
    removeButton.dispatchEvent(event);
  });
  ordinalNumber++;
  return trElement;
}

function initRemoveCategory() {
  document.addEventListener('removeCategory', async (e) => {
    try {
      const trElement = e.detail.elemntId;
      Swal.fire({
        title: 'Bạn có chắc là xóa?',
        text: 'Nếu xóa thì chuyên mục sẽ biến mất hoàn toàn trong database!',
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
          await categoryApi.removeById(e.detail.id);
          await toast.fire({
            icon: 'success',
            title: 'delete category successfully',
          });
          await handelFilterChange();
        }
      });
    } catch (error) {
      console.log(error);
      await toast.fire({
        icon: 'error',
        title: 'delete category failed',
      });
    }
  });
}

function renderCategoryList({ elemntId, data }) {
  const categoryList = document.getElementById(elemntId);
  console.log('categorylist', categoryList);
  if (!categoryList) return;
  categoryList.textContent = '';
  data.forEach((cate, index) => {
    const trElement = createCategoryElement(cate, index);
    categoryList.appendChild(trElement);
  });
}
// Main
(async () => {
  try {
    initRemoveCategory();
    handelFilterChange();
    //
  } catch (error) {
    console.log(error);
  }
})();
