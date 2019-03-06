import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Prompt } from "react-router-dom";
import { connect } from "react-redux";

import { getCurrentProfile } from "../../actions/profileActions";
import { createExperience } from "../../actions/experienceActions";
import { createEducation } from "../../actions/educationActions";

import TextFieldGroup from "../common/TextFieldGroup";

class HandleExperience extends Component {
  constructor(props) {
    super(props);
    const { location } = props;
    this.state = {
      // Control fields
      expOrEdu:
        location.pathname === "/dashboard/add-education"
          ? "Education"
          : "Experience",
      // School fields
      school: "",
      degree: "",
      fieldofstudy: "",
      // Career fields
      title: "",
      company: "",
      location: "",
      // Shared fields
      from: "",
      to: "",
      disabeld: false,
      current: false,
      description: "",
      // Helper fields
      Blocking: false,
      errors: {}
    };
  }
  componentDidMount() {
    if (this.props.profile.profile === null) {
      this.props.getCurrentProfile();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  handleSubmit = event => {
    event.preventDefault();
    if (this.state.expOrEdu === "Experience") {
      const experience = {
        title: this.state.title,
        company: this.state.company,
        location: this.state.location,
        from: this.state.from,
        to: this.state.to,
        current: this.state.current,
        description: this.state.description
      };
      this.props.createExperience(experience, this.props.history);
    } else if (this.state.expOrEdu === "Education") {
      const education = {
        school: this.state.school,
        degree: this.state.degree,
        fieldofstudy: this.state.fieldofstudy,
        from: this.state.from,
        to: this.state.to,
        current: this.state.current,
        description: this.state.description
      };
      this.props.createEducation(education, this.props.history);
    }
    this.setState({ Blocking: false });
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value, Blocking: true });
  };
  handleCurrentChange = event => {
    this.setState({
      [event.target.name]: event.target.checked,
      Blocking: true,
      disabled: event.target.checked
    });
  };
  render() {
    const { errors } = this.state;
    return (
      <div className="section add-experience">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">
                Add Your {this.state.expOrEdu}
              </h1>
              <p className="lead text-center">
                {this.state.expOrEdu === "Experience"
                  ? "Add any developer/programming positions that you have had in the past"
                  : "Add any school, bootcamp, etc that you have attended"}
              </p>
              <small className="d-block pb-3">
                (
                <i
                  className="fas fa-asterisk"
                  style={{ fontSize: "8px", color: "red" }}
                />
                ) Required fields
              </small>
              <form noValidate onSubmit={e => this.handleSubmit(e)}>
                <Prompt
                  when={this.state.Blocking}
                  message={location =>
                    `Are you sure you want to go to ${
                      location.pathname
                    },\nif so, infos here will be gone.`
                  }
                />
                {this.state.expOrEdu === "Experience" ? (
                  <>
                    <TextFieldGroup
                      placeholder="Job Title"
                      name="title"
                      value={this.state.title}
                      required="required"
                      error={errors.title}
                      onChange={e => this.handleChange(e)}
                    />
                    <TextFieldGroup
                      placeholder="Company"
                      name="company"
                      value={this.state.company}
                      required="required"
                      error={errors.company}
                      onChange={e => this.handleChange(e)}
                    />
                    <TextFieldGroup
                      placeholder="Location"
                      name="location"
                      value={this.state.location}
                      onChange={e => this.handleChange(e)}
                    />
                  </>
                ) : (
                  <>
                    <TextFieldGroup
                      placeholder="School Or Bootcamp"
                      name="school"
                      value={this.state.school}
                      required="required"
                      error={errors.school}
                      onChange={e => this.handleChange(e)}
                    />
                    <TextFieldGroup
                      placeholder="Degree Or Certificate"
                      name="degree"
                      value={this.state.degree}
                      required="required"
                      error={errors.degree}
                      onChange={e => this.handleChange(e)}
                    />
                    <TextFieldGroup
                      placeholder="Field Of Study"
                      name="fieldofstudy"
                      required="required"
                      error={errors.fieldofstudy}
                      value={this.state.fieldofstudy}
                      onChange={e => this.handleChange(e)}
                    />
                  </>
                )}

                <h6 className="text-muted">From Date</h6>
                <TextFieldGroup
                  type="date"
                  value={this.state.from}
                  name="from"
                  required="required"
                  error={errors.from}
                  onChange={e => this.handleChange(e)}
                />
                <h6 className="text-muted">To Date</h6>
                <TextFieldGroup
                  type="date"
                  name="to"
                  disabled={this.state.disabled}
                  value={this.state.to}
                  required="required"
                  error={errors.to}
                  onChange={e => this.handleChange(e)}
                />
                <TextFieldGroup
                  type="checkbox"
                  name="current"
                  label={
                    this.state.expOrEdu === "Experience"
                      ? "Current Job"
                      : "Current School"
                  }
                  value={this.state.current}
                  onChange={e => this.handleCurrentChange(e)}
                />
                <TextFieldGroup
                  group="textarea"
                  placeholder={
                    this.state.expOrEdu === "Experience"
                      ? "Job Description"
                      : "School Description"
                  }
                  name="description"
                  value={this.state.description}
                  info="Some of your responsabilities, etc"
                  onChange={e => this.handleChange(e)}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HandleExperience.propTypes = {
  errors: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  createExperience: PropTypes.func.isRequired,
  createEducation: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { createExperience, getCurrentProfile, createEducation }
)(HandleExperience);
