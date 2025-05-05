import React, {
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useState,
  useRef,
} from "react";
import "./ItemList.css";
import Item from "../Item";
import Pagination from "../Pagination";
import { linkSelector } from "../utils/js/Selectors";

/* ------------------------------------------------------------------
 *  helpers
 * ----------------------------------------------------------------*/
const parseGitItem = (elt, map) => ({
  title: elt[map.name],
  url: elt[map.html_url],
  author: elt[map.author.split("|")[0]][map.author.split("|")[1]],
  author_avatar:
    elt[map.author_avatar.split("|")[0]][map.author_avatar.split("|")[1]],
  stars: +elt[map.stars],
  forks: +elt[map.forks],
  issues: +elt[map.issues],
  language: elt[map.language],
  description: elt[map.description],
});

const parseGitlabItem = (elt, map) => {
  const avatarPath =
    elt[map.author_avatar.split("|")[0]][map.author_avatar.split("|")[1]];
  const avatar =
    !avatarPath || avatarPath.startsWith("http")
      ? avatarPath || ""
      : `https://gitlab.com${avatarPath}`;
  return {
    title: elt[map.name],
    url: elt[map.html_url],
    author: elt[map.author.split("|")[0]][map.author.split("|")[1]],
    author_avatar: avatar,
    stars: +elt[map.stars],
    forks: +elt[map.forks],
    issues: 0,
    language: "-",
    description: elt[map.description],
  };
};

const byStarsDesc = (a, b) => b.stars - a.stars;

/* ------------------------------------------------------------------
 *  reducer & initial state
 * ----------------------------------------------------------------*/
const initialState = {
  items: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "START_FETCH":
      return { ...state, loading: true, error: null };
    case "END_FETCH":
      return { items: action.payload, loading: false, error: null };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

/* ------------------------------------------------------------------
 *  component
 * ----------------------------------------------------------------*/
export default function ItemList({
  search,
  go_search,
  source: selectedSource,
  language: selectedLanguage,
  sort,
  order,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const abortRef = useRef();

  /* -------------------- fetch logic -------------------- */
  const buildItems = useCallback((src, data) => {
    const map = linkSelector[src];
    const arr =
      src === "github" ? data.items : src === "bitbucket" ? data.values : data;
    const parser = src === "gitlab" ? parseGitlabItem : parseGitItem;
    return arr.map((elt, idx) => ({
      index: idx,
      source: src,
      ...parser(elt, map),
    }));
  }, []);

  const fetchProjects = useCallback(
    async (term) => {
      if (!term) return;
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      dispatch({ type: "START_FETCH" });
      const q = term.toLowerCase();

      try {
        const requests = ["github", "gitlab", "bitbucket"].map((src) => {
          const link =
            linkSelector[src].link + q +
            (src === "github" || src === "gitlab"
              ? "&page=1&per_page=100"
              : "");
          return fetch(link, { signal: controller.signal })
            .then((r) => r.json())
            .then((data) => buildItems(src, data));
        });
        const results = (await Promise.all(requests)).flat();
        results.sort(byStarsDesc);
        dispatch({ type: "END_FETCH", payload: results });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          dispatch({ type: "ERROR", payload: err });
        }
      }
    },
    [buildItems]
  );

  /* trigger fetch on new search */
  const prevSearchRef = useRef("");
  useEffect(() => {
    if (go_search && search && search !== prevSearchRef.current) {
      prevSearchRef.current = search;
      setCurrentPage(1); // reset pagination on new search
      fetchProjects(search);
    }
  }, [go_search, search, fetchProjects]);

  /* -------------------- derived data -------------------- */
  const filteredItems = useMemo(() => {
    let tmp = state.items;

    if (selectedSource !== "all") {
      tmp = tmp.filter(
        (i) => i.source.toLowerCase() === selectedSource.toLowerCase()
      );
    }

    if (selectedLanguage !== "all") {
      tmp = tmp.filter(
        (i) => i.language?.toLowerCase() === selectedLanguage.toLowerCase()
      );
    }

    if (sort !== "all") {
      const key = sort === "star" ? "stars" : sort === "fork" ? "forks" : "issues";
      const dir = order === "asc" ? 1 : -1;
      tmp = [...tmp].sort((a, b) => (a[key] - b[key]) * dir);
    }

    return tmp;
  }, [state.items, selectedSource, selectedLanguage, sort, order]);

  const pageItems = useMemo(() => {
    const first = (currentPage - 1) * pageSize;
    return filteredItems.slice(first, first + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  /* -------------------- render helpers -------------------- */
  const renderItems = () => {
    if (state.loading) {
      return (
        <div>
          <br />
          <img
            src="/imgs/loading.gif"
            style={{ maxWidth: "100%", width: "20em", borderRadius: "100%" }}
            alt="loading"
          />
        </div>
      );
    }

    if (!pageItems.length) {
      return (
        <center>
          <h1>No results found!</h1>
        </center>
      );
    }

    return pageItems.map((elt, idx) => (
      <Item key={`${elt.source}-${idx}`} {...elt} />
    ));
  };

  /* -------------------- component JSX -------------------- */
  return (
    <div>
      <center>
        <div className="Item-List">
          {filteredItems.length > 0 && (
            <div style={{ width: "100%", textAlign: "center" }}>
              <span>Found {filteredItems.length} results.</span>
            </div>
          )}

          {/* status / items */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            {renderItems()}
          </div>

          {/* pagination */}
          {filteredItems.length > pageSize && (
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={filteredItems.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onViewAll={setPageSize}
            />
          )}

          {/* scroll‑to‑top */}
          {filteredItems.length > 0 && (
            <button
              onClick={() =>
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
              }
              style={{
                cursor: "pointer",
                position: "fixed",
                padding: "1rem 1.2rem",
                border: "none",
                fontSize: "11px",
                bottom: "40px",
                right: "40px",
                backgroundColor: "grey",
                color: "#fff",
                zIndex: 20,
              }}
            >
              Scroll to top
            </button>
          )}
        </div>
      </center>
    </div>
  );
}
