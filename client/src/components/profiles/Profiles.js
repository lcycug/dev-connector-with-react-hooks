import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { getProfiles } from "../../actions/profileActions";
import Spinner from "../common/Spinner";

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfiles();
  }
  render() {
    let profilesContent;
    const { profiles, loading } = this.props.profile;
    if (loading || profiles === null) {
      // New come in this page: loading data
      profilesContent = <Spinner />;
    } else {
      // After loading
      profilesContent = profiles.map((profile, i) => (
        <Fragment key={i}>
          <div className="card card-body bg-light mb-3">
            <div className="row">
              <div className="col-2">
                <img
                  className="rounded-circle"
                  src={profile.user.avatar}
                  alt=""
                />
              </div>
              <div className="col-lg-6 col-md-4 col-8">
                <h3>{profile.user.name}</h3>
                <p>{profile.status}</p>
                <p>{profile.location}</p>
                <Link
                  to={`/profile/${profile.handle}`}
                  className="btn btn-info"
                >
                  View Profile
                </Link>
              </div>
              <div className="col-md-4 d-none d-lg-block">
                <h4>Skill Set</h4>
                <ul className="list-group">
                  {profile.skills &&
                    profile.skills.map(skill => (
                      <li key={skill} className="list-group-item">
                        <i className="fa fa-check pr-1" />
                        {skill}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </Fragment>
      ));
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Developer Profiles</h1>
              <p className="lead text-center">
                Browse and connect with developers
              </p>

              {profilesContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
