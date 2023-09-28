import { renderOptions, clearOptions, validateFormField } from './utils/index.js';
import locationApi from './api/locationApi.js';

async function fetchLocationInfo(data, location, form) {
  if (!location || !data) return;

  switch (location) {
    case 'province':
      const district = await locationApi.getDistrict(data);
      ['district', 'ward'].forEach((name) => clearOptions(name));
      renderOptions(district.districts, 'district', form);
      break;
    case 'district':
      const ward = await locationApi.getWard(data);
      clearOptions('ward');
      renderOptions(ward.wards, 'ward', form);
      break;
    default:
      break;
  }
}

export function setAddressValue(form, housnumber = false) {
  const address = form.querySelector(`[name="address"]`);

  let str = '';
  const filedSelectOptions = ['ward', 'district', 'province'];
  if (housnumber) str += housnumber;

  filedSelectOptions.forEach((name) => {
    const filed = form.querySelector(`[name="${name}"]`);
    if (!filed) return;
    const filedValue = filed.options[filed.selectedIndex].value;
    if (!filedValue) return;

    str += filed.options[filed.selectedIndex].text;
  });
  str = str
    .replace(/Thành/g, ', Thành')
    .replace(/Huyện/g, ', Huyện')
    .replace(/Phường/g, ', Phường')
    .replace(/Quận/g, ', Quận')
    .replace(/Tỉnh/g, ', Tỉnh')
    .replace(/Xã/g, ', Xã');
  str = str.substring(0, str.length);
  address.value = str.trim();
}

export function initOnchangeLocation(form) {
  const filedSelectOptions = ['province', 'ward', 'district'];

  filedSelectOptions.forEach((name) => {
    const filed = form.querySelector(`[name="${name}"]`);
    if (!filed) return;

    filed.addEventListener('change', ({ target }) => {
      const selectedValue = target.options[target.selectedIndex].value;
      const filedName = target.name;
      fetchLocationInfo(selectedValue, filedName, form);
      setAddressValue(form);
      validateFormField(
        form,
        {
          [filedName]: selectedValue,
        },
        filedName
      );
    });
  });
}
