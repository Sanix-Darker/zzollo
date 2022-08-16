import React, { Component } from "react";
import "./App.css";
import "./components/utils/css/grid.css";
import ItemList from "./components/ItemList";
import LanguagesOption from "./components/utils/js/LanguagesOption";

class App extends Component {
  constructor() {
    super();
    this.state = {
      search: "",
      source: "all",
      language: "all",
      sort: "all",
      order: "all",
      go_search: false,
      collapseFilters: false, // Add state to handle show/hide filters
    };
    this.refText = React.createRef();
  }

  /**
   *
   * @param {*} event
   */
  handle_change(event) {
    if (event.key === "Enter") this.setState({ go_search: true });
    else this.setState({ go_search: false });
    this.setState({ search: event.target.value });

    this.setState({ search: event.target.value });
  }

  /**
   *
   * @param {*} event
   * @param {*} type
   */
  handle_change_option(event, type) {
    if (["source", "language", "sort", "order"].indexOf(type) !== -1) {
      let toUpdate = { go_search: true };
      toUpdate[type] = event.target.value !== "" ? event.target.value : "all";
      this.setState(toUpdate);
    }
  }

  /**
   *
   */
  go_search_change() {
    this.setState({
      go_search: !this.state.go_search,
    });
  }

  /**
   *
   */
  // handle hide/show filters on Click
  handleClick() {
    this.setState((prevState) => ({
      ...prevState,
      collapseFilters: !prevState.collapseFilters,
    }));
  }

  // get query parameter
  getQueryStringValue(key) {
    return decodeURIComponent(
      window.location.search.replace(
        new RegExp(
          "^(?:.*[&\\?]" +
            encodeURIComponent(key).replace(/[.+*]/g, "\\$&") +
            "(?:\\=([^&]*))?)?.*$",
          "i"
        ),
        "$1"
      )
    );
  }

  componentDidMount() {
    const searchText = this.getQueryStringValue("q");

    if (searchText !== "") {
      this.setState({
        search: searchText,
        go_search: true,
      });
    }
    this.refText.current.focus();
  }

  render() {
    const linkStyleNone = { color: "white", textDecoration: "none" };
    return (
      <div className="App">
        <header className="App-header">
          <div className="search-box">
            <p className="head">
              <a href="/" style={linkStyleNone}>
                <code>Zz0ll0</code>
              </a>
              <small>
                Search open-source projects on github / gitlab / bitbucket.
                &nbsp;
              </small>
              <b>
                <a
                  href="https://github.com/sanix-darker/zolo"
                  style={linkStyleNone}
                >
                  [Project-link]
                </a>
              </b>
            </p>

            <div className="row">
              <div className="col-md-12">
                <input
                  type="text"
                  ref={this.refText}
                  value={this.state.search}
                  className="search-zone"
                  onKeyUp={(event) => {
                    if (event.keyCode === 13)
                      window.document.location.href = "?q=" + this.state.search;
                    this.handle_change(event);
                  }}
                  onChange={(event) => this.handle_change(event)}
                  onClick={() => this.handleClick()} // handle hide/show filters on Click
                  placeholder="Search keyword(s) for open-source project(s)..."
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 zone">
                <input
                  list="source"
                  placeholder="From [Github / GitLab / Bitbucket]"
                  className="source-zone"
                  onKeyUp={(event) =>
                    this.handle_change_option(event, "source")
                  }
                />
                <datalist id="source">
                  <option value="all">
                    From [Github / GitLab / Bitbucket]
                  </option>
                  <option value="github">https://gitHub.com </option>
                  <option value="gitlab">https://gitlab.com </option>
                  <option value="bitbucket">https://bitbucket.org </option>
                </datalist>
              </div>
              <div className="col-md-3 zone">
                <input
                  list="languages"
                  className="language-zone"
                  placeholder="Filter by languages"
                  onKeyUp={(event) =>
                    this.handle_change_option(event, "language")
                  }
                />
                <datalist id="languages">
                  <option value="all">By languages</option>
                  {LanguagesOption}
                </datalist>
              </div>
              <div className="col-md-3 zone">
                <input
                  list="sort"
                  className="sort-zone"
                  placeholder="Filter By (Stars / Issues / fork)"
                  onKeyUp={(event) => this.handle_change_option(event, "sort")}
                />
                <datalist id="sort">
                  <option value="all">Filter By (Stars / Issues / fork)</option>
                  <option value="star">Sort by Stars</option>
                  <option value="issue">Sort by Issues</option>
                  <option value="fork">Sort by Forks</option>
                </datalist>
              </div>
              <div className="col-md-3 zone">
                <input
                  list="order"
                  className="order-zone"
                  placeholder="Filter by (Acsending/Descending))"
                  defaultValue=""
                  onKeyUp={(event) => this.handle_change_option(event, "order")}
                />
                <datalist id="order">
                  <option value="all">Filter by (Acsending/Descending))</option>
                  <option value="asc">Ascending order</option>
                  <option value="desc">Descending order</option>
                </datalist>
              </div>
            </div>
          </div>
          <ItemList
            search={this.state.search}
            source={this.state.source}
            language={this.state.language}
            sort={this.state.sort}
            order={this.state.order}
            go_search={this.state.go_search}
          />
        </header>
      </div>
    );
  }
}

export default App;
