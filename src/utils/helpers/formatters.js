//Convert knex result into json
export const rowDataToJson = (rowData) => {
  let result = Object.values(JSON.parse(JSON.stringify(rowData)));
  return result;
};

//Format object keys for error message
export const formatKey = (key) => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

//Format phone number
export const formatPhoneNumber = (numberString) => {
  const countryCode = numberString.substring(0, numberString.length - 10);
  const digits = numberString.substring(countryCode.length);

  const areaCode = digits.substring(0, 3);
  const centralOfficeCode = digits.substring(3, 6);
  const lineNumber = digits.substring(6);

  return `+${countryCode} (${areaCode}) ${centralOfficeCode}-${lineNumber}`;
};
