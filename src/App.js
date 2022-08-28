import React, { useState,useRef, useEffect } from "react";
import "./App.css";
import "./components/utils/css/grid.css";
import ItemList from "./components/ItemList";
import LanguagesOption from "./components/utils/js/LanguagesOption";

function App () {

    const [search, setSearch] = useState('')
    const [source , setSource] = useState('all')
    const [language, setLanguage] = useState('all')
    const [sort , setSort] = useState('all')
    const [order , setOrder] = useState('all')
    const [go_search, setGoSearch] = useState(false)
    const [collapseFilters , setCollapseFilters] = useState(false)
    const refText = useRef()

  function handle_change(event) {
    if (event.key === "Enter") setGoSearch(true);
    else setGoSearch(false);
    setSearch(event.target.value);
  }

  function handle_change_option(event, type) {
    if (["source", "language", "sort", "order"].indexOf(type) !== -1) {
      let toUpdate = { go_search: true }
      toUpdate[type] = event.target.value !== "" ? event.target.value : "all";
      if(type==="source") setSource(toUpdate[type])
      else if(type==="language") setLanguage(toUpdate[type])
      else if(type==="sort") setSort(toUpdate[type])
      else setOrder(toUpdate[type])
      setGoSearch(true)
    }
  }

  // handle hide/show filters on Click
  function handleClick() {
    setCollapseFilters((state) => !state)
  }

  // get query parameter
  function getQueryStringValue(key) {
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

  useEffect(() => {
    const searchText = getQueryStringValue("q");
    if (searchText !== "") {
      setSearch(searchText)
      setGoSearch(true)
    }
    refText.current.focus();
  }, [])

  const linkStyleNone = { color: "white", textDecoration: "none" }
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
                  ref={refText}
                  value={search}
                  className="search-zone"
                  onKeyUp={(event) => {
                    if (event.key === 13)
                      window.document.location.href = "?q=" + search;
                    handle_change(event);
                  }}
                  onChange={(event) => handle_change(event)}
                  onClick={() => handleClick()} // handle hide/show filters on Click
                  title="Click on the text box to show/hide others filters."
                  placeholder="Search keyword(s) for open-source project(s)..."
                />
              </div>
            </div>
            {collapseFilters && (
              <div className="row">
                <div className="col-md-3 zone">
                  <input
                    list="source"
                    placeholder="From [Github / GitLab / Bitbucket]"
                    className="source-zone"
                    onKeyUp={(event) =>
                    handle_change_option(event, "source")
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
                      handle_change_option(event, "language")
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
                    onKeyUp={(event) =>
                      handle_change_option(event, "sort")
                    }
                  />
                  <datalist id="sort">
                    <option value="all">
                      Filter By (Stars / Issues / fork)
                    </option>
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
                    onKeyUp={(event) =>
                      handle_change_option(event, "order")
                    }
                  />
                  <datalist id="order">
                    <option value="all">
                      Filter by (Acsending/Descending)
                    </option>
                    <option value="asc">Ascending order</option>
                    <option value="desc">Descending order</option>
                  </datalist>
                </div>
              </div>
            )}
          </div>
          <ItemList
            search={search}
            source={source}
            language={language}
            sort={sort}
            order={order}
            go_search={go_search}
          />
        </header>
      </div>
    );
}

export default App;
