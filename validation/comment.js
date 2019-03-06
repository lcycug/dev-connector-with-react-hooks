const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateCommentInput(data) {
  const errors = {};
  let { text } = data;
  text = !isEmpty(text) ? text : "";

  if (Validator.isEmpty(text)) {
    errors.text = "Text is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
