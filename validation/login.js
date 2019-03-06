const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  let { password, email } = data;
  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";

  // Email rules
  if (Validator.isEmpty(email)) {
    errors.email = "Email is required.";
  } else {
    if (!Validator.isEmail(email)) {
      errors.email = "Email is invalid.";
    }
  }

  // Password rules
  if (Validator.isEmpty(password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
