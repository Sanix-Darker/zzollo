import React, { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import ItemList from "./components/ItemList";

const SOURCES = [
  { value: "all", label: "All Sources" },
  { value: "github", label: "GitHub" },
  { value: "gitlab", label: "GitLab" },
  { value: "bitbucket", label: "Bitbucket" },
];

const LANGUAGES = [
  "All", "JavaScript", "TypeScript", "Python", "Java", "C", "C++", "C#",
  "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "Shell",
  "HTML", "CSS", "SQL", "R", "Dart", "Lua", "Perl", "Haskell", "Elixir"
];

const SORT_OPTIONS = [
  { value: "all", label: "Best Match" },
  { value: "star", label: "Stars" },
  { value: "fork", label: "Forks" },
  { value: "issue", label: "Issues" },
];

function App() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    source: "all",
    language: "all",
    sort: "all",
    order: "desc",
  });
  const [shouldSearch, setShouldSearch] = useState(false);
  const inputRef = useRef();

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (search.trim()) setShouldSearch(true);
  }, [search]);

  const handleSearch = useCallback((e) => {
    if (e.key === "Enter" && search.trim()) {
      setShouldSearch(true);
      window.history.replaceState(null, "", `?q=${encodeURIComponent(search)}`);
    }
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setSearch(q);
      setShouldSearch(true);
    }
    inputRef.current?.focus();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <a href="/" className="logo">zzollo</a>
        <p className="tagline">Search open-source projects across GitHub, GitLab & Bitbucket</p>
      </header>

      <main className="main">
        <div className="search-container">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search projects..."
            className="search-input"
            aria-label="Search projects"
          />
          <button
            className="search-btn"
            onClick={() => search.trim() && setShouldSearch(true)}
            aria-label="Search"
          >
            →
          </button>
        </div>

        <div className="filters">
          <select
            value={filters.source}
            onChange={(e) => updateFilter("source", e.target.value)}
            className="filter-select"
            aria-label="Filter by source"
          >
            {SOURCES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <select
            value={filters.language}
            onChange={(e) => updateFilter("language", e.target.value)}
            className="filter-select"
            aria-label="Filter by language"
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang.toLowerCase()}>{lang}</option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="filter-select"
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <button
            className={`order-btn ${filters.order === "desc" ? "active" : ""}`}
            onClick={() => updateFilter("order", filters.order === "desc" ? "asc" : "desc")}
            aria-label={`Sort ${filters.order === "desc" ? "ascending" : "descending"}`}
          >
            {filters.order === "desc" ? "↓" : "↑"}
          </button>
        </div>

        <ItemList
          search={search}
          filters={filters}
          shouldSearch={shouldSearch}
          onSearchComplete={() => setShouldSearch(false)}
        />
      </main>

      <footer className="footer">
        <a href="https://github.com/sanix-darker/zzollo" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;
