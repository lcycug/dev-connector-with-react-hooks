import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import classnames from "classnames";
import PropTypes from "prop-types";

import { getPosts, likePost, deletePost } from "../../actions/postActions";
import { getCurrentProfile } from "../../actions/profileActions";
import Spinner from "../common/Spinner";

class Posts extends Component {
  constructor(props) {
    super(props);
    this.props.getPosts();
    if (this.props.profile.profile === null) {
      this.props.getCurrentProfile();
    }
    this.state = {
      profile: this.props.profile, // Used for like a comment css
      postable: false,
      posts: null,
      loading: true
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.post) {
      this.setState({
        posts: nextProps.post.posts,
        loading: false
      });
    }
    if (
      nextProps.profile &&
      nextProps.profile.profile &&
      Object.keys(nextProps.profile.profile).length
    ) {
      this.setState({
        profile: nextProps.profile.profile,
        loading: false,
        postable: true
      });
    }
  }
  handleClick = event => {
    if (this.state.postable) {
      this.props.likePost(event.currentTarget.id);
    }
  };
  handleDelete = event => {
    this.props.deletePost(event.currentTarget.id);
  };
  render() {
    const { posts, loading, profile, postable } = this.state;
    let postsContent;
    if (loading || posts === null || profile === null) {
      postsContent = <Spinner />;
    } else {
      postsContent = (
        <>
          {/* <!-- Post Feed --> */}
          <div className="posts">
            {/* <!-- Post Item --> */}
            {Array.isArray(posts) &&
              posts.length > 0 &&
              posts.map(post => (
                <Fragment key={post._id}>
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
                        <button
                          id={post._id}
                          type="button"
                          className="btn btn-light mr-1"
                          onClick={!postable ? null : e => this.handleClick(e)}
                        >
                          <i
                            className={classnames("fas fa-thumbs-up", {
                              "text-info": !postable
                                ? false
                                : post.likes.filter(
                                    like =>
                                      like.user.toString() === profile.user._id
                                  ).length !== 0,
                              "text-secondary": !postable
                                ? true
                                : post.likes.filter(
                                    like =>
                                      like.user.toString() === profile.user._id
                                  ).length === 0
                            })}
                          />
                          <span className="badge badge-light">
                            {post.likes && post.likes.length}
                          </span>
                        </button>
                        <Link
                          to={`/feed/post/${post._id}`}
                          className="btn btn-info mr-1"
                        >
                          Comments
                        </Link>
                        {profile &&
                        profile.user &&
                        profile.user._id === post.user ? (
                          <button
                            id={post._id}
                            onClick={e => this.handleDelete(e)}
                            type="button"
                            className="btn btn-danger mr-1"
                          >
                            <i className="fas fa-times" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}
          </div>
        </>
      );
    }
    return postsContent;
  }
}

Posts.propTypes = {
  post: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getPosts, likePost, getCurrentProfile, deletePost }
)(Posts);
