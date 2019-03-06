const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validatePostInput(data) {
  const errors = {};
  let { text } = data;

  text = !isEmpty(text) ? text : "";

  // Rules
  if (Validator.isEmpty(text)) {
    errors.text = "Text is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
