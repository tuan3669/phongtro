import packageApi from './api/packageApi.js';
import paymentApi from './api/payment.js';
function createPackageElement(pack) {
  const searchParams = new URLSearchParams(window.location.search);
  const postId = searchParams.get('postId');
  if (!postId) return;
  const packageTemplate = document.getElementById('packageTemplate').cloneNode(true).content;
  const liElement = packageTemplate.firstElementChild;
  console.log(liElement);
  if (!liElement || !pack) return;
  const name = liElement.querySelector('[data-id="name"]');
  if (!name) return;
  name.textContent = pack?.name;

  const price = liElement.querySelector('[data-id="price"]').lastElementChild;
  if (!price) return;
  price.textContent = new Intl.NumberFormat('en-DE').format(pack?.price) + ' đồng';

  const duration = liElement.querySelector('[data-id="duration"]').lastElementChild;
  if (!duration) return;
  duration.textContent = pack?.duration + ' ngày';

  const description = liElement.querySelector('[data-id="description"]').lastElementChild;
  if (!description) return;
  description.textContent = pack?.description;

  const button = liElement.querySelector('[data-id="buy"]');

  button.addEventListener('click', async (e) => {
    try {
      console.log('click me');
      const newData = {
        amount: pack.price,
        postId: postId,
        packId: pack._id,
      };

      // create_payment_url;
      const { vnpUrl } = await paymentApi.add(newData);
      console.log(vnpUrl);
      window.location.assign(vnpUrl);
    } catch (error) {
      console.log('error :: ', error);
    }
  });
  return liElement;
}

function renderPackageList({ elemntId, data }) {
  const packageList = document.getElementById(elemntId);
  if (!packageList) return;
  packageList.innerHTML = '';
  data.forEach((pack) => {
    const liElement = createPackageElement(pack);
    packageList.appendChild(liElement);
  });
}
// Main
(async () => {
  try {
    const { data } = await packageApi.getAll();
    renderPackageList({
      elemntId: 'packageList',
      data,
    });
    //
  } catch (error) {
    console.log(error);
  }
})();
