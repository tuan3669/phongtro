import depositApi from './api/depositApi.js';
import { formatDate } from './utils/common.js';

async function handelFilterChange(filterName, filterValue) {
  const queryPamrams = new URL(window.location);
  if (filterName) queryPamrams.searchParams.set(filterName, filterValue);
  history.pushState({}, '', queryPamrams);

  // call api
  const { data } = await depositApi.getAll(queryPamrams.searchParams);
  renderDepositList({
    elemntId: 'depositList',
    data,
  });
}

function createDepositElement(data, index) {
  const depositTemplate = document.getElementById('depositTemplate').cloneNode(true).content;
  const trElement = depositTemplate.firstElementChild;
  if (!trElement || !data) return;
  const name = trElement.querySelector('[data-id="name"]');
  if (!name) return;
  name.textContent = data?.name;

  const price = trElement.querySelector('[data-id="price"]');
  if (!price) return;
  price.textContent = new Intl.NumberFormat('en-DE').format(data?.price) + ' đồng';

  const date = trElement.querySelector('[data-id="date"]');
  if (!date) return;
  date.textContent = formatDate(data.created_at);

  const code = trElement.querySelector('[data-id="code"]');
  if (!code) return;

  code.textContent = data?.transaction_id;

  const status = trElement.querySelector('[data-id="status"]');
  if (!status) return;
  status.textContent = data?.status === 'success' ? 'Thành công' : 'Thất bại';

  const note = trElement.querySelector('[data-id="note"]');
  if (!note) return;
  const encodedString = data?.payment_info;
  const decodedString = decodeURIComponent(encodedString.replaceAll('+', ' '));
  note.textContent = decodedString;

  return trElement;
}

function renderDepositList({ elemntId, data }) {
  const depositList = document.getElementById(elemntId);
  if (!depositList) return;
  depositList.textContent = '';
  data.forEach((item, index) => {
    const trElement = createDepositElement(item, index);
    depositList.appendChild(trElement);
  });
}
// Main
(async () => {
  try {
    handelFilterChange();
    //
  } catch (error) {
    console.log(error);
  }
})();
