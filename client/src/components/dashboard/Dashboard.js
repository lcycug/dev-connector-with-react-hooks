import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Spinner from "../common/Spinner";

import Table from "./ExperienceTable";

import {
  getCurrentProfile,
  setProfileLoading
} from "../../actions/profileActions";

import { deleteExperience } from "../../actions/experienceActions";

class Dashboard extends Component {
  componentDidMount() {
    // if (this.props.profile.profile === null) {
    this.props.setProfileLoading();
    this.props.getCurrentProfile();
    // }
  }
  handleClick = event => {
    this.props.deleteExperience(event.target.id, event.target.name);
  };
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    let dashboardContent;
    if (profile === null || loading) {
      // Loading
      dashboardContent = <Spinner />;
    } else {
      // After Loading
      if (!Object.keys(profile).length) {
        // No profile for current user
        dashboardContent = (
          <div className="btn-group mb-4" role="group">
            <Link to="/dashboard/create-new-profile" className="btn btn-info ">
              Create New Profile
            </Link>
          </div>
        );
      } else {
        // Profile display
        dashboardContent = (
          <>
            <div className="btn-group mb-4" role="group">
              <Link to="/dashboard/edit-profile" className="btn btn-light">
                <i className="fas fa-user-circle text-info mr-1" /> Edit Profile
              </Link>
              <Link to="/dashboard/add-experience" className="btn btn-light">
                <i className="fab fa-black-tie text-info mr-1" />
                Add Experience
              </Link>
              <Link to="/dashboard/add-education" className="btn btn-light">
                <i className="fas fa-graduation-cap text-info mr-1" />
                Add Education
              </Link>
            </div>
            <Table
              experiences={profile.experience}
              handleDeleteClick={e => this.handleClick(e)}
            />
            <Table
              experiences={profile.education}
              handleDeleteClick={e => this.handleClick(e)}
              type="Education"
            />
          </>
        );
      }
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4">Dashboard</h1>
            <p className="lead text-muted">Welcome {user.name}</p>
            {dashboardContent}
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  setProfileLoading: PropTypes.func.isRequired,
  deleteExperience: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, setProfileLoading, deleteExperience }
)(Dashboard);
