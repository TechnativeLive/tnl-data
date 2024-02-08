import countries from './iso-3166.json';
export { countries, countrySelectionCode2 };

const countrySelectionCode2 = countries.map((country) => ({
  label: country.name,
  value: country.code2,
}));
