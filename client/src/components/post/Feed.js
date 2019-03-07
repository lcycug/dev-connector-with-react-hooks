import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { createPost, getPosts } from "../../actions/postActions";
import { getCurrentProfile } from "../../actions/profileActions";
import TextFieldGroup from "../common/TextFieldGroup";
import PostList from "./PostList";

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      postable: false,
      text: "",
      errors: {}
    };
    this.props.getCurrentProfile();
    this.props.getPosts();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ text: "" });
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (
      nextProps.profile &&
      nextProps.profile.profile !== null &&
      Object.keys(nextProps.profile.profile).length !== 0
    ) {
      this.setState({ profile: nextProps.profile.profile, postable: true });
    }
  }
  handleChange = event => {
    const { postable } = this.state;
    if (postable) {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  };
  handleSubmit = event => {
    event.preventDefault();
    const { postable } = this.state;
    if (postable) {
      this.props.createPost({ text: this.state.text });
    }
  };
  render() {
    const { errors, postable } = this.state;
    return (
      <>
        <div className="feed">
          <div className="container">
            {!postable && (
              <div className="bg-warning text-center font-weight-bold p-3 mb-2">
                <Link to="/dashboard/create-new-profile">
                  Profile editing is the previous step for posting.
                </Link>
              </div>
            )}
            <div className="row">
              <div className="col-md-12">
                {/* <!-- Post Form --> */}
                <div className="post-form mb-3">
                  <div className="card card-info">
                    <div className="card-header bg-info text-white">
                      Say Somthing...
                    </div>
                    <div className="card-body">
                      <form onSubmit={e => this.handleSubmit(e)}>
                        <TextFieldGroup
                          group="textarea"
                          name="text"
                          value={this.state.text}
                          placeholder="Create a post"
                          onChange={e => this.handleChange(e)}
                          error={errors.text}
                          disabled={!postable ? "disabled" : null}
                        />
                        <button type="submit" className="btn btn-dark mt-3">
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <PostList />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Feed.propTypes = {
  errors: PropTypes.object.isRequired,
  createPost: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { createPost, getCurrentProfile, getPosts }
)(Feed);
