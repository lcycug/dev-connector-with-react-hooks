const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  let { name, password, password2, email } = data;
  name = !isEmpty(name) ? name : "";
  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";
  password2 = !isEmpty(password2) ? password2 : "";

  // Name rules
  if (!name) {
    errors.name = "Name is required.";
  } else {
    if (!Validator.isLength(name, { min: 2, max: 30 })) {
      errors.name = "Name should be between 2 and 30 characters.";
    }
  }

  // Email rules
  if (!email) {
    errors.email = "Email is required.";
  } else {
    if (!Validator.isEmail(email)) {
      errors.email = "Email is invalid.";
    }
  }

  // Password rules
  if (!password) {
    errors.password = "Password is required";
  } else {
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = "Password should be between 6 and 30 characters.";
    } else {
      if (!password2) {
        errors.password2 = "Confirm password is required.";
      } else {
        if (!Validator.equals(password, password2)) {
          errors.password2 = "Passwords do not match!";
        }
      }
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
