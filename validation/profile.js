const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateProfileInput(data) {
  const errors = {};
  const handle = !isEmpty(data.handle) ? data.handle : "";
  const status = !isEmpty(data.status) ? data.status : "";
  const skills = !isEmpty(data.skills) ? data.skills.toString() : "";

  if (Validator.isEmpty(handle)) {
    errors.handle = "Handle is required.";
  } else {
    if (!Validator.isLength(handle, { min: 2, max: 40 })) {
      errors.handle = "Handle should be between 2 and 40 characters.";
    }
  }

  if (Validator.isEmpty(status)) {
    errors.status = "Status is required.";
  }

  if (Validator.isEmpty(skills)) {
    errors.skills = "Skills is required.";
  }

  const website = !isEmpty(data.website) ? data.website : "";
  const youtube = !isEmpty(data.youtube) ? data.youtube : "";
  const facebook = !isEmpty(data.facebook) ? data.facebook : "";
  const instagram = !isEmpty(data.instagram) ? data.instagram : "";
  const linkedin = !isEmpty(data.linkedin) ? data.linkedin : "";
  const twitter = !isEmpty(data.twitter) ? data.twitter : "";

  if (!Validator.isEmpty(website) && !Validator.isURL(website)) {
    errors.website = "Website URL is invalid.";
  }
  if (!Validator.isEmpty(youtube) && !Validator.isURL(youtube)) {
    errors.youtube = "Youtube URL is invalid.";
  }
  if (!Validator.isEmpty(facebook) && !Validator.isURL(facebook)) {
    errors.facebook = "Facebook URL is invalid.";
  }
  if (!Validator.isEmpty(instagram) && !Validator.isURL(instagram)) {
    errors.instagram = "Instagram URL is invalid.";
  }
  if (!Validator.isEmpty(linkedin) && !Validator.isURL(linkedin)) {
    errors.linkedin = "Linkedin URL is invalid.";
  }
  if (!Validator.isEmpty(twitter) && !Validator.isURL(twitter)) {
    errors.twitter = "Twitter URL is invalid.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
