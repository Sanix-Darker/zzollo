import React,  { useEffect, useState } from "react";
import "./ItemList.css";
import Item from "../Item";
import Pagination from "../Pagination";
import { linkSelector } from "../utils/js/Selectors";

function ItemList (props) {

    const [precedentSearch, setPrecedentSearch] = useState("")
    const [links, setLinks] = useState(linkSelector)
    const [items , setItems] = useState([])
    const [itemOrig, setItemsOrig]=useState([])
    const [load, setLoad] = useState(true)
    const [count, setCount] = useState(0)
    const [pageSize, setPageSize] = useState(12)
    const [currentPage, setCurrentPage] = useState(1)

  const pushNewItems = (items, source, resData, source_object) => {
    resData &&
      resData.map((elt, index) => {
        const author = source_object["author"].split("|");
        const author_avatar = source_object["author_avatar"].split("|");

        if (source === "github" || source === "bitbucket") {
          items.push({
            index: index,
            source: source,
            title: elt[source_object["name"]],
            url: elt[source_object["html_url"]],
            author: elt[author[0]][author[1]],
            author_avatar: elt[author_avatar[0]][author_avatar[1]],
            stars: parseInt(elt[source_object["stars"]]),
            forks: parseInt(elt[source_object["forks"]]),
            issues: parseInt(elt[source_object["issues"]]),
            language: elt[source_object["language"]],
            description: elt[source_object["description"]],
          });
        } else if (source === "gitlab") {
          let avatar = "";
          if (
            typeof elt[author_avatar[0]][author_avatar[1]] != "undefined" &&
            elt[author_avatar[0]][author_avatar[1]] != null
          ) {
            avatar =
              elt[author_avatar[0]][author_avatar[1]].indexOf("http") === -1
                ? "https://gitlab.com" + elt[author_avatar[0]][author_avatar[1]]
                : elt[author_avatar[0]][author_avatar[1]];
          }
          items.push({
            index: index,
            source: source,
            title: elt[source_object["name"]],
            url: elt[source_object["html_url"]],
            author: elt[author[0]][author[1]],
            author_avatar: avatar,
            stars: parseInt(elt[source_object["stars"]]),
            forks: parseInt(elt[source_object["forks"]]),
            issues: 0,
            language: "-",
            description: elt[source_object["description"]],
          });
        }

        return true;
      });
    // perform a sort
    items.sort((a, b) => a.stars - b.stars).reverse();
    setLoad(false);
    setItems(items);
    setItemsOrig(items);
    setCount(items.length)
    return items;
  }

  const getresults = (items, source, search, page) => {
    return new Promise((resolve, reject) => {
      const linkToFetch = links[source]["link"] + search;

      fetch(
        source === "github" || source === "gitlab"
          ? linkToFetch + "&page=" + page + "&per_page=100"
          : linkToFetch
      )
        .then(async (response) => {
          const resData = await response.json();
          const source_object = links[source];

          items = pushNewItems(
            items,
            source,
            source === "github"
              ? resData["items"]
              : source === "bitbucket"
              ? resData["values"]
              : resData,
            source_object
          );
          resolve(items);
        })
        .catch((error) => {
          // this.setState({ errorMessage: error.toString() });
          console.error("There was an error!", error);
        });
    });
  }

  const fetch_projects = (search) => {
    search = search.toLowerCase();
    let items = [];

    getresults(items, "github", search, 1).then((returned_items) => {
      getresults(returned_items, "gitlab", search, 1).then(
        (returned_items2) => {
          getresults(returned_items2, "bitbucket", search, 1).then(
            (res) => {
              console.log("[+] Fetches ended !");
            }
          );
        }
      );
    });
  };

  useEffect(()=> {
    if (props.go_search === true) {
      if (props.search !== precedentSearch) {
        setPrecedentSearch(props.search);
        setItems([]);
        setItemsOrig([]);
        setLoad(true);
        fetch_projects(props.search);
      }
    }
     // eslint-disable-next-line
  },[props.go_search])
  
  useEffect(()=> {
    if (props.source !== "all") {
      const filterItems = itemOrig.filter((elt) => {
        return elt["source"] !== null
          ? elt["source"].toLowerCase() === props.source.toLowerCase()
          : null;
      })
      setItems(filterItems)
    } else {
      setItems(itemOrig)
    }
     // eslint-disable-next-line
  },[props.source])

  useEffect(()=> {
    if (props.language !== "all") {
      const filterItems = itemOrig.filter((elt) => {
        return elt["language"] !== null
          ? elt["language"].toLowerCase() ===
          props.language.toLowerCase()
          : null;
      })
      setItems(filterItems)
    }
     // eslint-disable-next-line
  },[props.language])

  useEffect(() => {
    if (props.sort !== "all") {
      if (props.sort === "star") {
        if (props.order === "desc") {
          const filterItems = itemOrig.sort((a, b) => a.stars - b.stars).reverse()
          setItems(filterItems)
        } else {
          const filterItems = itemOrig.sort((a, b) => a.stars - b.stars)
          setItems(filterItems)
        }
      } else if (props.sort === "fork") {
        if (props.order === "desc") {
          const filterItems = itemOrig.sort((a, b) => a.forks - b.forks).reverse()
          setItems(filterItems)
        } else {
            const filterItems = itemOrig.sort((a, b) => a.forks - b.forks)
            setItems(filterItems)
        }
      } else if (props.sort === "issue") {
        if (props.order === "desc") {
          const filterItems = itemOrig.sort((a, b) => a.issues - b.issues).reverse()
          setItems(filterItems)
        } else {
          const filterItems = itemOrig.sort((a, b) => a.issues - b.issues)
          setItems(filterItems)
        }
      }
    }
     // eslint-disable-next-line
  },[props.sort, props.order])

  useEffect(()=> {
    console.log("Search useEffect for search = %s", props.search);
    setItems([]);
    if(props.search !== "" && props.go_search === true){
      fetch_projects(props.search)
    }
     // eslint-disable-next-line
  },[props.search])

  const filterItemsByLanguage = (items, { language: selectedLanguage }) => {
    if (selectedLanguage === "all") {
      return items;
    }

    return items.filter((elt) => {
      const language = elt && elt["language"];
      return language?.toLowerCase() === selectedLanguage?.toLowerCase();
    });
  }

  const getItemsByPage = (items) => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return items.slice(firstPageIndex, lastPageIndex);
  }

  const getItemsComponents = (itemsTodisplay) => {
    if(itemsTodisplay == null){
      setCount(itemsTodisplay.length);
    }
    const itemsFilter = filterItemsByLanguage(itemsTodisplay,props);
    const finalItem = getItemsByPage(itemsFilter);
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
          
        >
          {
            items.length > 0 ? (
              <div style={{ width: "100%", textAlign: "center" }}>
                <span> Found {count} results. </span>
              </div>
            ) : null
          }
          
          {finalItem && finalItem.length > 0 ? (
            finalItem.map((elt, index) => {
              return (
                <Item
                  key={index}
                  source={elt.source}
                  url={elt.url}
                  title={elt.title}
                  author={elt.author}
                  author_avatar={elt.author_avatar}
                  language={elt.language}
                  stars={elt.stars}
                  issues={elt.issues}
                  forks={elt.forks}
                  description={elt.description}
                />
              );
            })
          ) : (
            <center>
              <h1>No results found !!!</h1>
            </center>
          )}
        </div>
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={items.length}
          pageSize={pageSize}
          onPageChange={(page) => this.setState({ currentPage: page })}
          onViewAll={(itemCount) => this.setState({ pageSize: itemCount })}
        />
      </div>
    );
  }
    return (
      <div>
        <center>
          <div className="Item-List">
            {count > 0 ? (
              
              <div style={{ width: "100%", textAlign: "center" }}>
                <br />
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                  }}
                  style={{
                    cursor: "pointer",
                    display: "block",
                    zIndex: 20,
                    position: "fixed",
                    padding: "1rem 1.2rem",
                    border: "none",
                    fontSize: "11px",
                    bottom: "40px",
                    right: "40px",
                    backgroundColor: "grey",
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  Scroll to top
                </button>
              </div>
            ) : null}
            <br />
            {(props.search === "" || props.go_search === false) &&
            load ? (
              <div>
                <br />
                <img src="/imgs/cat.gif" alt="" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                  <path
                    fill="#ffffff"
                    fillOpacity="1"
                    d="M0,32L21.8,64C43.6,96,87,160,131,165.3C174.5,171,218,117,262,133.3C305.5,149,349,235,393,272C436.4,309,480,299,524,266.7C567.3,235,611,181,655,186.7C698.2,192,742,256,785,256C829.1,256,873,192,916,149.3C960,107,1004,85,1047,80C1090.9,75,1135,85,1178,117.3C1221.8,149,1265,203,1309,234.7C1352.7,267,1396,277,1418,282.7L1440,288L1440,320L1418.2,320C1396.4,320,1353,320,1309,320C1265.5,320,1222,320,1178,320C1134.5,320,1091,320,1047,320C1003.6,320,960,320,916,320C872.7,320,829,320,785,320C741.8,320,698,320,655,320C610.9,320,567,320,524,320C480,320,436,320,393,320C349.1,320,305,320,262,320C218.2,320,175,320,131,320C87.3,320,44,320,22,320L0,320Z"
                    style={{ "--darkreader-inline-fill": "#181a1b;" }}
                    data-darkreader-inline-fill=""
                  ></path>
                </svg>
              </div>
            ) : load ? (
              <div>
                {" "}
                <br />
                <img
                  src="/imgs/loading.gif"
                  style={{
                    maxWidth: "100%",
                    width: "20em",
                    borderRadius: "100%",
                    boxShadow: "0 3px 7px rgba(0,0,0,0.54)",
                  }}
                  alt=""
                />
              </div>
            ) : (
              getItemsComponents(items)
            )}
          </div>
        </center>
      </div>
    );
}

export default ItemList;
