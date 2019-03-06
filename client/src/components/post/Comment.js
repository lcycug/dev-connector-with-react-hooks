import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { getSinglePost, postComment } from "../../actions/postActions";
import { getCurrentProfile } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import TextFieldGroup from "../common/TextFieldGroup";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      profile: null,
      loading: true,
      errors: {},
      comment: ""
    };
    this.props.getSinglePost(
      this.props.location.pathname.substring("/feed/post/".length)
    );
    if (this.props.profile.profile === null) {
      this.props.getCurrentProfile();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.post) {
      this.setState({ post: nextProps.post.post, loading: false, comment: "" });
    }
    if (nextProps.profile) {
      this.setState({ profile: nextProps.profile.profile });
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    const { comment, post, profile } = this.state;
    const postable = profile !== null && Object.keys(profile).length !== 0;
    if (postable) {
      this.props.postComment(post._id, { text: comment });
    }

    // this.setState({ comment: "", errors: {} });
  };
  render() {
    const { loading, post, errors, profile } = this.state;
    const postable = profile !== null && Object.keys(profile).length !== 0;
    let commentContent;
    if (loading || post === null) {
      commentContent = <Spinner />;
    } else {
      commentContent = (
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
                <form onSubmit={e => this.handleSubmit(e)}>
                  <TextFieldGroup
                    group="textarea"
                    placeholder="Create a post"
                    name="comment"
                    value={this.state.comment}
                    error={errors.text}
                    onChange={e => this.handleChange(e)}
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
              <div className="col-md-12">{commentContent}</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Comment.propTypes = {
  post: PropTypes.object.isRequired,
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
  { getSinglePost, postComment, getCurrentProfile }
)(Comment);
