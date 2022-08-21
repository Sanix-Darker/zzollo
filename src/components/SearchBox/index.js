import React, { Component } from "react";

class SearchBox extends Component {
  constructor() {
    super();
    this.state = {
      search: "",
      source: "all",
      language: "all",
      sort: "all",
      order: "all",
      go_search: false,
    };
  }

  refreshParentState() {
    // We send those parameters to the parent
    this.props.handleState(this.state);
  }

  handle_change(event) {
    if (event.key === "Enter") {
      this.setState({ go_search: true });
    } else {
      this.setState({ go_search: false });
    }

    this.setState({ search: event.target.value });
    this.refreshParentState();
  }

  handle_change_option(event, type) {
    if (["source", "lang", "sort", "order"].indexOf(type) !== -1) {
      let toUpdate = { go_search: true };
      toUpdate[type] = event.target.selectedOptions[0].value;
      this.setState(toUpdate);
    }
    this.refreshParentState();
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <input
              type="text"
              className="search-zone"
              onKeyUp={(event) => this.handle_change(event)}
              placeholder="Search keyword(s) for open-source project(s)..."
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 zone">
            <select
              className="language-zone"
              defaultValue="all"
              onChange={(event) => this.handle_change_option(event, "source")}
            >
              <option value="all">From [Github / GitLab / Bitbucket]</option>
              <option value="github">GitHub</option>
              <option value="gitlab">GitLab</option>
              <option value="bitbucket">BitBucket</option>
            </select>
          </div>
          <div className="col-md-3 zone">
            <select
              className="language-zone"
              defaultValue="all"
              onChange={(event) => this.handle_change_option(event, "lang")}
            >
              <option value="all">By languages</option>
              {this.props.LanguagesOption}
            </select>
          </div>
          <div className="col-md-3 zone">
            <select
              className="sort-zone"
              defaultValue="all"
              onChange={(event) => this.handle_change_option(event, "sort")}
            >
              <option value="all">By (Stars / Issues / fork)</option>
              <option value="star">Sort by Stars</option>
              <option value="issue">Sort by Issues</option>
              <option value="fork">Sort by Forks</option>
            </select>
          </div>
          <div className="col-md-3 zone">
            <select
              className="order-zone"
              defaultValue="all"
              onChange={(event) => this.handle_change_option(event, "order")}
            >
              <option value="all">Filter by (Acsending/Descending))</option>
              <option value="asc">Ascending order</option>
              <option value="desc">Descending order</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchBox;
