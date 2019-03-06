const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateExperienceInput(data) {
  const errors = {};
  let { title, company, from, to, current } = data;

  title = !isEmpty(title) ? title : "";
  company = !isEmpty(company) ? company : "";
  from = !isEmpty(from) ? from : "";
  to = !isEmpty(to) ? to : "";

  // Rules
  if (Validator.isEmpty(title)) {
    errors.title = "Title is required.";
  }
  if (Validator.isEmpty(company)) {
    errors.company = "Company is required.";
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
