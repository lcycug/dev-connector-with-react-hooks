const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateEducationInput(data) {
  const errors = {};
  let { school, degree, fieldofstudy, from, to, current } = data;

  school = !isEmpty(school) ? school : "";
  degree = !isEmpty(degree) ? degree : "";
  fieldofstudy = !isEmpty(fieldofstudy) ? fieldofstudy : "";
  from = !isEmpty(from) ? from : "";
  to = !isEmpty(to) ? to : "";

  // Rules
  if (Validator.isEmpty(school)) {
    errors.school = "School is required.";
  }
  if (Validator.isEmpty(degree)) {
    errors.degree = "Degree is required.";
  }
  if (Validator.isEmpty(fieldofstudy)) {
    errors.fieldofstudy = "Study field is required.";
  }
  if (Validator.isEmpty(from)) {
    errors.from = "From date is required.";
  }

  if (!current && Validator.isEmpty(to)) {
    errors.to = "To date is required when `current` is unchecked.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
