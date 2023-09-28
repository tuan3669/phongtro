import packageApi from './api/packageApi.js';

async function handelFilterChange(filterName, filterValue) {
  const queryPamrams = new URL(window.location);
  if (filterName) queryPamrams.searchParams.set(filterName, filterValue);
  history.pushState({}, '', queryPamrams);

  // call api
  const { data } = await packageApi.getAll(queryPamrams.searchParams);
  renderPackageList({
    elemntId: 'packageList',
    data,
  });
}

function createPackageElement(pack, index) {
  const packageTemplate = document.getElementById('packageTemplate').cloneNode(true).content;
  const trElement = packageTemplate.firstElementChild;
  let ordinalNumber = index + 1;
  if (!trElement || !pack) return;
  const name = trElement.querySelector('[data-id="name"]');
  if (!name) return;
  name.textContent = pack?.name;

  const price = trElement.querySelector('[data-id="price"]');
  if (!price) return;
  price.textContent = pack?.price;

  const number = trElement.querySelector('[data-id="number"]');
  if (!number) return;
  number.textContent = ordinalNumber;

  const duration = trElement.querySelector('[data-id="date"]');
  if (!duration) return;
  duration.textContent = pack?.duration;

  const active = trElement.querySelector('[data-id="active"]');
  if (!active) return;
  active.textContent = pack?.active;

  const buttons = trElement.querySelector('[data-id="action"]');
  if (!buttons) return;

  const description = trElement.querySelector('[data-id="description"]');
  if (!description) return;
  description.textContent = pack?.description;

  const editButton = trElement.querySelector('#edit-btn');
  const removeButton = trElement.querySelector('#remove-btn');

  editButton.addEventListener('click', (e) => {
    window.location.assign(
      `https://puce-determined-raven.cyclic.app/packages/add-edit?id=${pack._id}`
    );
  });
  removeButton.addEventListener('click', () => {
    const trElement = removeButton.closest('tr');

    if (!trElement) return;
    let event = new CustomEvent('removePackage', {
      bubbles: true,
      detail: { elemntId: trElement, id: pack._id },
    });
    removeButton.dispatchEvent(event);
  });
  ordinalNumber++;
  return trElement;
}

function initRemovePackage() {
  document.addEventListener('removePackage', async (e) => {
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
          await packageApi.removeById(e.detail.id);
          await toast.fire({
            icon: 'success',
            title: 'delete package successfully',
          });
          await handelFilterChange();
        }
      });
    } catch (error) {
      console.log(error);
      await toast.fire({
        icon: 'error',
        title: 'delete package failed',
      });
    }
  });
}

function renderPackageList({ elemntId, data }) {
  const packageList = document.getElementById(elemntId);
  if (!packageList) return;
  packageList.textContent = '';
  data.forEach((pack, index) => {
    const trElement = createPackageElement(pack, index);
    packageList.appendChild(trElement);
  });
}
// Main
(async () => {
  try {
    initRemovePackage();
    handelFilterChange();
    //
  } catch (error) {
    console.log(error);
  }
})();
