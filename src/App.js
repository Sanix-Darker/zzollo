import React, {
  useReducer,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import "./App.css";
import "./components/utils/css/grid.css";
import ItemList from "./components/ItemList";
import LanguagesOption from "./components/utils/js/LanguagesOption";

// -------------------------- utils --------------------------
const debounce = (fn, delay = 400) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

// ------------------------- reducer -------------------------
const initialState = {
  search: "",
  source: "all",
  language: "all",
  sort: "all",
  order: "all",
  collapseFilters: false,
  goSearch: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, goSearch: action.trigger };
    case "SET_FILTER":
      return { ...state, [action.key]: action.value, goSearch: true };
    case "TOGGLE_COLLAPSE":
      return { ...state, collapseFilters: !state.collapseFilters };
    case "RESET_TRIGGER":
      return { ...state, goSearch: false };
    default:
      return state;
  }
}

// --------------------------- app ---------------------------
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { search, source, language, sort, order, collapseFilters, goSearch } =
    state;

  const refText = useRef(null);

  // focus search box on first render
  useEffect(() => {
    refText.current?.focus();
  }, []);

  // read ?q param only once on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) dispatch({ type: "SET_SEARCH", payload: q, trigger: true });
  }, []);

  // update URL when we intentionally trigger a search
  const syncUrl = useCallback(
    debounce((value) => {
      if (value) {
        window.history.replaceState(null, "", `?q=${encodeURIComponent(value)}`);
      } else {
        window.history.replaceState(null, "", window.location.pathname);
      }
      dispatch({ type: "RESET_TRIGGER" });
    }, 300),
    []
  );

  useEffect(() => {
    if (goSearch) syncUrl(search);
  }, [goSearch, search, syncUrl]);

  // -------------------- handlers --------------------
  const handleSearch = useCallback(
    (e) =>
      dispatch({
        type: "SET_SEARCH",
        payload: e.target.value,
        trigger: e.key === "Enter",
      }),
    []
  );

  const handleFilter = useCallback((e, key) => {
    const value = e.target.value || "all";
    dispatch({ type: "SET_FILTER", key, value });
  }, []);

  const toggleCollapse = useCallback(
    () => dispatch({ type: "TOGGLE_COLLAPSE" }),
    []
  );

  const linkStyleNone = useMemo(
    () => ({ color: "white", textDecoration: "none" }),
    []
  );

  return (
    <div className="App">
      <header className="App-header">
        <div className="search-box">
          <p className="head">
            <a href="/" style={linkStyleNone}>
              <code>Zz0ll0</code>
            </a>
            <small>
              Search open-source projects on github / gitlab / bitbucket. &nbsp;
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

          {/* ------------- search input ------------- */}
          <div className="row">
            <div className="col-md-12">
              <input
                type="text"
                ref={refText}
                value={search}
                className="search-zone"
                onChange={handleSearch}
                onKeyUp={handleSearch}
                onClick={toggleCollapse}
                title="Click on the text box to show/hide other filters."
                placeholder="Search keyword(s) for open-source project(s)..."
              />
            </div>
          </div>

          {/* ------------- filters ------------- */}
          {collapseFilters && (
            <div className="row">
              <FilterColumn
                id="source"
                className="source-zone"
                placeholder="From [Github / GitLab / Bitbucket]"
                onChange={(e) => handleFilter(e, "source")}
                options={[
                  { value: "all", label: "From [Github / GitLab / Bitbucket]" },
                  { value: "github", label: "https://github.com" },
                  { value: "gitlab", label: "https://gitlab.com" },
                  { value: "bitbucket", label: "https://bitbucket.org" },
                ]}
              />

              <FilterColumn
                id="languages"
                className="language-zone"
                placeholder="Filter by languages"
                onChange={(e) => handleFilter(e, "language")}
                options={LanguagesOption}
              />

              <FilterColumn
                id="sort"
                className="sort-zone"
                placeholder="Filter By (Stars / Issues / Forks)"
                onChange={(e) => handleFilter(e, "sort")}
                options={[
                  { value: "all", label: "Filter By (Stars / Issues / Forks)" },
                  { value: "star", label: "Sort by Stars" },
                  { value: "issue", label: "Sort by Issues" },
                  { value: "fork", label: "Sort by Forks" },
                ]}
              />

              <FilterColumn
                id="order"
                className="order-zone"
                placeholder="Order (Ascending/Descending)"
                onChange={(e) => handleFilter(e, "order")}
                options={[
                  { value: "all", label: "Order (Ascending/Descending)" },
                  { value: "asc", label: "Ascending order" },
                  { value: "desc", label: "Descending order" },
                ]}
              />
            </div>
          )}
        </div>

        {/* ------------- results ------------- */}
        <ItemList
          search={search}
          source={source}
          language={language}
          sort={sort}
          order={order}
          go_search={goSearch}
        />
      </header>
    </div>
  );
}

// ---------------------- FilterColumn ----------------------
const FilterColumn = React.memo(
  ({ id, placeholder, className, onChange, options = [], customOptions = null }) => (
    <div className="col-md-3 zone">
      <input
        list={id}
        className={className}
        placeholder={placeholder}
        onChange={onChange}
      />
      <datalist id={id}>
        {customOptions
          ? customOptions
          : options.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
      </datalist>
    </div>
  )
);
