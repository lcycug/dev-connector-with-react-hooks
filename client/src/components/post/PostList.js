import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import classnames from "classnames";
import PropTypes from "prop-types";

import { likePost, deletePost } from "../../actions/postActions";
import Spinner from "../common/Spinner";

const PostList = props => {
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState({});
  const [postable, setPostable] = useState(false);

  useEffect(() => {
    props.profile && props.profile.profile && setProfile(props.profile.profile);
  });

  useEffect(() => {
    props.post && props.post.posts && setPosts(props.post.posts);
  });

  useEffect(() => {
    props.profile &&
      props.profile.profile &&
      props.profile.profile.handle &&
      setPostable(true);
  });

  const handleClick = event => {
    if (!postable) return alert("Profile is the previous step to comment.");
    props.likePost(event.currentTarget.id);
  };

  const handleDelete = event => {
    props.deletePost(event.currentTarget.id);
  };

  const alreadyComment = post => {
    return (
      post &&
      post.likes &&
      profile &&
      profile.user &&
      post.likes.filter(like => like.user.toString() === profile.user._id)
        .length !== 0
    );
  };

  let postList;
  if (Object.keys(posts).length === 0) {
    postList = <Spinner />;
  } else {
    postList = (
      <>
        {/* <!-- Post Feed --> */}
        <div className="posts">
          {/* <!-- Post Item --> */}
          {posts.map(post => (
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
                      onClick={handleClick}
                    >
                      <i
                        className={classnames("fas fa-thumbs-up", {
                          "text-info": !postable ? false : alreadyComment(post),
                          "text-secondary": !postable
                            ? true
                            : !alreadyComment(post)
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
                        onClick={handleDelete}
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
  return postList;
};

PostList.propTypes = {
  post: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  likePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { likePost, deletePost }
)(PostList);
