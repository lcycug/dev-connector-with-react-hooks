const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// Load valiadtion rules
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

/**
 * @router  /api/profile/test
 * @desc    Router profile test
 * @access  Public
 */
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

/**
 * @router  GET /api/profile
 * @desc    Get profile of the current user
 * @access  Private
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for the current user.";
          return res.status(404).json(errors);
        }
        res.json(profile);
      });
  }
);

/**
 * @router  GET /api/profile/handle/:handle
 * @desc    Get profile under a handle
 * @access  Public
 */
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user.";
        res.status(404).json(errors);
      }
      res.json(profile);
    });
});

/**
 * @router  GET /api/profile/user/:user_id
 * @desc    Get profile under id of a user
 * @access  Public
 */
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user.";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      errors.noprofile = "There is no profile for this user.";
      res.json(errors);
    });
});

/**
 * @router  GET /api/profile/all
 * @desc    Get all profiles
 * @access  Public
 */
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles in database.";
        res.status(404).json(errors);
      }
      res.json(profiles);
    });
});

/**
 * @router  POST /api/profile
 * @desc    Create OR update profile of the current user
 * @access  Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle)
      profileFields.handle = req.body.handle
        .split(" ")
        .join("")
        .toLowerCase();
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills
    if (typeof req.body.skills) {
      profileFields.skills = req.body.skills
        .toString()
        .split(",")
        .map(item => item.toString().trim());
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => {
          res.json(profile);
        });
      } else {
        // Create
        // Handle check
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists.";
            return res.status(400).json(errors);
          }

          // Save profile
          new Profile(profileFields)
            .save()
            .then(profile => res.json(profile))
            .catch(err => console.log(err));
        });
      }
    });
  }
);

/**
 * @router  POST /api/profile/experience
 * @desc    Add experience
 * @access  Private
 */
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (!profile) {
        errors.profile = "There is no profile for experience addition.";
        res.status(404).json(errors);
      }
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      profile.experience.unshift(newExp);

      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => console.log(err));
    });
  }
);

/**
 * @router  POST /api/profile/education
 * @desc    Add education
 * @access  Private
 */
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (!profile) {
        errors.profile = "There is no profile for experience addition.";
        res.status(404).json(errors);
      }
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        location: req.body.location,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

/**
 * @router  DELETE /api/profile/experience/:exp_id
 * @desc    Delete experience
 * @access  Private
 */
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const removeIndex = profile.experience
          .map(exp => exp.id)
          .indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.json(err));
  }
);

/**
 * @router  DELETE /api/profile/education/:edu_id
 * @desc    Delete education
 * @access  Private
 */
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        profile.education = [
          ...profile.education.filter(edu => edu.id !== req.params.edu_id)
        ];

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.json(err));
  }
);

/**
 * @router  DELETE /api/profile
 * @desc    Delete user and profile
 * @access  Private
 */
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
