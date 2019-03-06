const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// Load validation rules
const validatePostInput = require("../../validation/post");
const validateCommentInput = require("../../validation/comment");

/**
 * @router  /api/posts/test
 * @desc    Router posts test
 * @access  Public
 */
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

/**
 * @router  POST /api/posts/
 * @desc    Create post
 * @access  Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.profile = "No profile";
          return res.status(404).json(errors);
        }

        const newPost = new Post({
          user: req.user.id,
          name: req.user.name,
          avatar: req.user.avatar,
          handle: profile.handle,
          text: req.body.text
        });

        newPost
          .save()
          // .then(post => res.json(post))
          .then(post => {
            Post.find()
              .sort({ date: -1 })
              .then(posts => res.json(posts));
          })
          .catch(err => console.error(err));
      })
      .catch(err => res.status(400).json(err));
  }
);

/**
 * @router  GET /api/posts/
 * @desc    Get posts
 * @access  Public
 */
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err));
});

/**
 * @router  GET /api/posts/:id
 * @desc    Get single post
 * @access  Public
 */
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json(err));
});

/**
 * @router  DELETE /api/posts/:post_id
 * @desc    Delete post
 * @access  Private
 */
router.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.post_id).then(post => {
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized." });
          }

          // Deletion
          post
            .remove()
            .then(() => {
              Post.find()
                .sort({ date: -1 })
                .then(posts => res.json(posts));
            })
            .catch(err => res.json(err));
        });
      })
      .catch(err => res.json(err));
  }
);

/**
 * @router  POST /api/posts/like/:post_id
 * @desc    Like a post
 * @access  Private
 */
router.post(
  "/like/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.post_id).then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length
          ) {
            errors.alreadyliked = "The user already liked the post.";
            return res.status(400).json(errors);
          }

          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });
          post
            .save()
            // .then(post => res.json(post))
            .then(post => {
              Post.find()
                .sort({ date: -1 })
                .then(posts => res.json(posts))
                .catch(err => res.status(404).json(err));
            })
            .catch(err => res.json(err));
        });
      })
      .catch(err => res.json(err));
  }
);

/**
 * @router  POST /api/posts/unlike/:post_id
 * @desc    Unlike a post
 * @access  Private
 */
router.post(
  "/unlike/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.post_id).then(post => {
          if (
            !post.likes.filter(like => like.user.toString() === req.user.id)
              .length
          ) {
            errors.notliked = "You have not yet liked the post.";
            return res.status(400).json(errors);
          }

          // Remove like
          post.likes = [
            ...post.likes.filter(like => like.user.toString() !== req.user.id)
          ];

          post
            .save()
            .then(post => res.json(post))
            .catch(err => res.json(err));
        });
      })
      .catch(err => res.json(err));
  }
);

/**
 * @router  POST /api/posts/likeunlike/:post_id
 * @desc    Like a post
 * @access  Private
 */
router.post(
  "/likeunlike/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.post_id).then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length
          ) {
            // Unlike
            // Remove like
            post.likes = [
              ...post.likes.filter(like => like.user.toString() !== req.user.id)
            ];
          } else {
            // Like
            post.likes.unshift({ user: req.user.id });
          }
          post
            .save()
            // .then(post => res.json(post))
            .then(post => {
              Post.find()
                .sort({ date: -1 })
                .then(posts => res.json(posts))
                .catch(err => res.status(404).json(err));
            })
            .catch(err => res.json(err));
        });
      })
      .catch(err => res.json(err));
  }
);

/**
 * @router  POST /api/posts/comment/:post_id
 * @desc    Comment a post
 * @access  Private
 */
router.post(
  "/comment/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.post_id).then(post => {
          // Add user id to likes array
          if (!post.comments) {
            post.comments = [];
          }
          post.comments.unshift({
            user: req.user.id,
            handle: profile.handle,
            text: req.body.text,
            name: req.user.name,
            avatar: req.user.avatar
          });
          post
            .save()
            .then(post => res.json(post))
            .catch(err => res.json(err));
        });
      })
      .catch(err => res.status(404).json(err));
  }
);

/**
 * @router  DELETE /api/posts/comment/:comment_id
 * @desc    Delete a comment of a post
 * @access  Private
 */
router.delete(
  "/comment/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.post_id)
          .then(post => {
            if (!post) {
              errors.postnotfound = "Post not found.";
              return res.status(404).json(errors);
            }
            // Delete comment
            if (
              !post.comments.filter(
                comment => comment._id.toString() === req.params.comment_id
              ).length
            ) {
              errors.commentnotfound = "Comment not found.";
              res.status(404).json(errors);
            } else {
              post.comments = [
                ...post.comments.filter(
                  comment => comment._id.toString() !== req.params.comment_id
                )
              ];

              post
                .save()
                .then(post => res.json(post))
                .catch(err => res.json(err));
            }
          })
          .catch(err => {
            errors.postnotfound = "Post not found.";
            res.status(404).json(errors);
          });
      })
      .catch(err => res.json(err));
  }
);

module.exports = router;
