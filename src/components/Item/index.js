import React from "react";
import "./Item.css";

const SOURCE_ICONS = {
  github: (
    <svg viewBox="0 0 16 16" fill="currentColor" className="source-icon">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  ),
  gitlab: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="source-icon">
      <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 014.82 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0118.6 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.51L23 13.45a.84.84 0 01-.35.94z"/>
    </svg>
  ),
  bitbucket: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="source-icon">
      <path d="M.778 1.211a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z"/>
    </svg>
  ),
};

function formatNumber(num) {
  if (!num || isNaN(num)) return "0";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}

function truncate(str, len) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "..." : str;
}

function Item({ source, name, url, author, avatar, stars, forks, issues, language, description }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="item">
      <div className="item-header">
        <div className="item-title-row">
          {SOURCE_ICONS[source]}
          <h3 className="item-title">{truncate(name, 28)}</h3>
        </div>
        {language && <span className="item-lang">{language}</span>}
      </div>

      <p className="item-desc">{truncate(description, 100) || "No description"}</p>

      <div className="item-footer">
        <div className="item-author">
          {avatar && <img src={avatar} alt="" className="item-avatar" />}
          <span>{truncate(author, 20)}</span>
        </div>
        <div className="item-stats">
          <span title="Stars">★ {formatNumber(stars)}</span>
          <span title="Forks">⑂ {formatNumber(forks)}</span>
          {source === "github" && <span title="Issues">◉ {formatNumber(issues)}</span>}
        </div>
      </div>
    </a>
  );
}

export default Item;
