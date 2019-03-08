import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getHandleProfile } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import GithubCard from "../common/GithubCard";
import ExperienceCard from "./ExperienceCard";

function Profile(props) {
  const handle = props.location.pathname.substring("/profile/".length);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    props.getHandleProfile(handle);
  }, []);

  useEffect(() => {
    props.profile && props.profile.profile && setProfile(props.profile.profile);
  });

  let profileContent;
  if (profile === null || profile.handle !== handle) {
    profileContent = <Spinner />;
  } else {
    profileContent = (
      <>
        {/* <!-- Profile Header --> */}
        <div className="row">
          <div className="col-md-12">
            <div className="card card-body bg-info text-white mb-3">
              <div className="row">
                <div className="col-4 col-md-3 m-auto">
                  <img
                    className="rounded-circle"
                    src={profile.user.avatar}
                    alt=""
                  />
                </div>
              </div>
              <div className="text-center">
                <h1 className="display-4 text-center">{profile.user.name}</h1>
                <p className="lead text-center">{profile.status}</p>
                <p>{profile.location}</p>
                <p>
                  <a className="text-white p-2" href={profile.website}>
                    <i className="fas fa-globe fa-2x" />
                  </a>
                  {profile.social &&
                    Object.keys(profile.social).length &&
                    Object.keys(profile.social).map(social => (
                      <a
                        key={social}
                        className="text-white p-2"
                        href={profile.social[social]}
                      >
                        <i className={`fab fa-${social} fa-2x`} />
                      </a>
                    ))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Profile About --> */}
        <div className="row">
          <div className="col-md-12">
            <div className="card card-body bg-light mb-3">
              {profile.bio ? (
                <>
                  <h3 className="text-center text-info">
                    {profile.user.name}'s Bio
                  </h3>
                  <p className="lead">{profile.bio}</p>
                  <hr />
                </>
              ) : null}
              {profile.skills && profile.skills.length > 0 ? (
                <>
                  <h3 className="text-center text-info">Skill Set</h3>
                  <div className="row">
                    <div className="d-flex flex-wrap justify-content-center align-items-center">
                      {profile.skills.map(skill => (
                        <div key={skill} className="p-3">
                          <i className="fa fa-check" /> {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* <!-- Profile Creds --> */}
        <div className="row">
          <ExperienceCard type="Experience" experiences={profile.experience} />
          <ExperienceCard type="Education" experiences={profile.education} />
        </div>
        {/* <!-- Profile Github --> */}
        <GithubCard username={profile.githubusername} />
      </>
    );
  }
  return (
    <>
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-6">
                  <Link
                    to="/profiles"
                    className="btn btn-light mb-3 float-left"
                  >
                    Back To Profiles
                  </Link>
                </div>
                <div className="col-6" />
              </div>
              {profileContent}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  getHandleProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getHandleProfile }
)(Profile);
