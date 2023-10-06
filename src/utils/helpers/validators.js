import { formatKey } from "./formatters.js";

//Validate email address
export const isValidEmail = (str) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
};

//Validate phone number
export const isValidPhoneNumber = (str) => {
  const regex = /^\+\d{1,3} \(\d{3}\) \d{3}-\d{4}$/;
  return regex.test(str);
};

//Validate request object keys
export const validateRequestBody = (keys, req, callback) => {
  for (let key of keys) {
    if (!req?.body?.[key]) {
      return callback(false, `Missing ${formatKey(key)}.`);
    }
  }
  return callback(true, "All keys are present.");
};
