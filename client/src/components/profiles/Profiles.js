import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { getProfiles } from "../../actions/profileActions";

import Spinner from "../common/Spinner";

function ProfileList(props) {
  const [profiles, setProfiles] = useState(null);
  useEffect(() => {
    props.getProfiles();
  }, []);
  useEffect(() => {
    props.profile &&
      props.profile.profiles &&
      setProfiles(props.profile.profiles);
  });
  let profileList;
  if (profiles === null) {
    profileList = <Spinner />;
  } else {
    profileList = profiles.map((profile, i) => (
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
              <Link to={`/profile/${profile.handle}`} className="btn btn-info">
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
            {profileList}
          </div>
        </div>
      </div>
    </div>
  );
}

ProfileList.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(ProfileList);
