import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { getSinglePost, postComment } from "../../actions/postActions";
import { getCurrentProfile } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import TextFieldGroup from "../common/TextFieldGroup";

function CommentBox(props) {
  const [post, setPost] = useState(null);
  const [profile, setProfile] = useState(null);
  const [postable, setPostable] = useState(false);
  const [errors, setErrors] = useState({});
  const [comment, setComment] = useState("");
  const postId = props.location.pathname.substring("/feed/post/".length);

  useEffect(() => {
    props.getSinglePost(postId);
  }, []);

  useEffect(() => {
    props.getCurrentProfile();
  }, []);

  useEffect(() => {
    props.post && props.post.post && setPost(props.post.post);
    props.profile && props.profile.profile && setProfile(props.profile.profile);
    if (props.profile && props.profile.profile && props.profile.profile) {
      setPostable(true);
    }
    props.errors && setErrors(props.errors);
  });

  const handleChange = event => {
    if (!postable) return alert("No profile.");
    setComment(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!postable) return alert("No profile.");
    props.postComment(postId, { text: comment });
    setComment("");
  };

  let commentBox;
  if (post === null || profile === null) {
    commentBox = <Spinner />;
  } else {
    commentBox = (
      <>
        {/* <!-- Post Item --> */}
        <div className="card card-body mb-3">
          <div className="row">
            <div className="col-md-2">
              <Link to={`/profile/${post.handle}`}>
                <img
                  className="rounded-circle d-none d-md-block"
                  src={post.avatar}
                  alt={post.name}
                />
              </Link>
              <br />
              <p className="text-center">{post.name}</p>
            </div>
            <div className="col-md-10">
              <p className="lead">{post.text}</p>
            </div>
          </div>
        </div>
        {/* <!-- Comment Form --> */}
        <div className="post-form mb-3">
          <div className="card card-info">
            <div className="card-header bg-info text-white">
              Say Somthing...
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <TextFieldGroup
                  group="textarea"
                  placeholder="Create a post"
                  name="comment"
                  value={comment}
                  error={errors.text}
                  onChange={handleChange}
                  disabled={postable ? null : "disabled"}
                />
                <button type="submit" className="btn btn-dark mt-3">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* <!-- Comment Feed --> */}
        <div className="comments">
          {post.comments &&
            post.comments.map(comment => (
              <Fragment>
                {/* <!-- Comment Item --> */}
                <div className="card card-body mb-3">
                  <div className="row">
                    <div className="col-md-2">
                      <Link to={`/profile/${comment.handle}`}>
                        <img
                          className="rounded-circle d-none d-md-block"
                          src={comment.avatar}
                          alt=""
                        />
                      </Link>
                      <br />
                      <p className="text-center">{comment.name}</p>
                    </div>
                    <div className="col-md-10">
                      <p className="lead">{comment.text}</p>
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="post">
        <div className="container">
          {!postable && (
            <div className="bg-warning text-center font-weight-bold p-3 mb-2">
              <Link to="/dashboard/create-new-profile">
                Profile editing is the previous step for posting.
              </Link>
            </div>
          )}
          <div className="row">
            <div className="col-md-12">{commentBox}</div>
          </div>
        </div>
      </div>
    </>
  );
}

CommentBox.propTypes = {
  post: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  postComment: PropTypes.func.isRequired,
  getSinglePost: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { postComment, getSinglePost, getCurrentProfile }
)(CommentBox);
