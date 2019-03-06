import React, { Component, Fragment } from "react";
import Spinner from "./Spinner";

class GithubCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      repos: null,
      sort: "created",
      per_page: 5,
      page: 1
    };
  }

  componentDidMount() {
    if (this.state.username !== null) {
      const { page, per_page, sort } = this.state;
      const { username } = this.props;

      fetch(
        `https://api.github.com/users/${username}/repos?per_page=${per_page}&page=${page}&sort=${sort}`
      )
        .then(res => res.json())
        .then(data => {
          this.setState({
            repos: !data.message ? data : [],
            loading: false
          });
        })
        .catch(err => console.error(err));
    }
  }
  render() {
    const { loading, repos } = this.state;
    let githubContent;
    if (loading || repos === null) {
      githubContent = <Spinner />;
    } else {
      githubContent = (
        <>
          <div ref="myRef">
            <hr />
            <h3 className="mb-4">Latest Github Repos</h3>
            <div className="card card-body mb-2">
              {repos.map((repo, i) => (
                <Fragment key={i}>
                  <div key={repo.id} className="row">
                    <div className="col-md-6">
                      <h4>
                        <a
                          href={repo.html_url}
                          className="text-info"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {" "}
                          {repo.name}
                        </a>
                      </h4>
                      <p>{repo.description}</p>
                    </div>
                    <div className="col-md-6">
                      <span className="badge badge-info mr-1">
                        Stars: {repo.stargazers_count}
                      </span>
                      <span className="badge badge-secondary mr-1">
                        Watchers: {repo.watchers_count}
                      </span>
                      <span className="badge badge-success">
                        Forks: {repo.forks_count}
                      </span>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </>
      );
    }
    return <>{githubContent}</>;
  }
}

export default GithubCard;
