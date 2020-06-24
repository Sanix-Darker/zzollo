import React, {Component} from 'react';
import './ItemList.css';
import Item from './Item';
import { link_selector } from './Selectors'
// import axios from 'axios';

class ItemList extends Component {

    constructor() {
        super()
        this.state = {
            precedent_search: "",
            links: link_selector,
            items: [],
            items_orig: [],
            load: true,
            count: 0
        }
    }

    fetch_projects = (search) => {
        search = search.toLowerCase();


        let source = "github";
        fetch(this.state.links[source]["link"] + search + "&page=1&per_page=250")
        .then(async response => {
            let resData = await response.json();
            let items = [];
            let source_object = this.state.links[source];

            resData["items"].map((elt, index) => {
                const author = source_object["author"].split("|");
                const author_avatar = source_object["author_avatar"].split("|");
 
                 items.push({
                     "index": index,
                     "source": source,
                     "title": elt[source_object["name"]],
                     "url": elt[source_object["html_url"]],
                     "author": elt[author[0]][author[1]],
                     "author_avatar": elt[author_avatar[0]][author_avatar[1]],
                     "stars": parseInt(elt[source_object["stars"]]),
                     "forks": elt[source_object["forks"]],
                     "issues": elt[source_object["issues"]],
                     "language": elt[source_object["language"]],
                     "description": elt[source_object["description"]]
                 });
                 return true;
            });
            
            items.sort((a, b) => a.stars - b.stars).reverse();;
            this.setState({
                load: false,
                items: items,
                items_orig: items,
                count: items.length
            });

            source = "gitlab";
            fetch(this.state.links[source]["link"] + search + "&page=1&per_page=100")
            .then(async response => {
                resData = await response.json();
                source_object = this.state.links[source];
                
                resData.map((elt, index) => {
                    const author = source_object["author"].split("|");
                    const author_avatar = source_object["author_avatar"].split("|");
                    let avatar=""; 
                    if (typeof(elt[author_avatar[0]][author_avatar[1]]) != "undefined" && elt[author_avatar[0]][author_avatar[1]] != null){
                        avatar = (elt[author_avatar[0]][author_avatar[1]].indexOf("http") === -1) ? "https://gitlab.com" + elt[author_avatar[0]][author_avatar[1]] : elt[author_avatar[0]][author_avatar[1]];
                    }
                    items.push({
                         "index": index,
                         "source": source,
                         "title": elt[source_object["name"]],
                         "url": elt[source_object["html_url"]],
                         "author": elt[author[0]][author[1]],
                         "author_avatar": avatar,
                         "stars": parseInt(elt[source_object["stars"]]),
                         "forks": elt[source_object["forks"]],
                         "issues": "-",
                         "language": "-",
                         "description": elt[source_object["description"]]
                     });
                     return true;
                });
                // perform a sort
                items.sort((a, b) => a.stars - b.stars).reverse();;
                this.setState({
                    load: false,
                    items: items,
                    items_orig: items,
                    count: items.length
                });

            }).catch(error => {
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });

        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.go_search === true){

            if (nextProps.search !== this.state.precedent_search){
                this.setState({
                    precedent_search: nextProps.search,
                    items: [],
                    items_orig: [],
                    load: true
                });
                this.fetch_projects(nextProps.search);
            }

            if (nextProps.language !== "all"){
                this.setState({
                    items: this.state.items_orig.filter(elt => {
                        return (elt["language"] !== null) ? (elt["language"].toLowerCase() === nextProps.language.toLowerCase()) : null
                    }),
                });
            }else{
                this.setState({
                    items: this.state.items_orig
                });
            }
        }
    }

    componentDidMount(){
        this.setState({ items: [] });
        this.fetch_projects("reactjs");
    }

    filterItemsByLanguage(items, { language: selectedLanguage }) {
        if (selectedLanguage === "all") {
            return items;
        }

        return items.filter(elt => {
                        const language = elt && elt["language"];
                        return language?.toLowerCase() === selectedLanguage?.toLowerCase();
        });
    }

    render() {
        const loader = (<img src="/loading.gif" alt=""/>);
        const items = this.filterItemsByLanguage(this.state.items, this.props);
        let item_list = (<div style={{"display": "flex", "flexWrap": "wrap"}}>
                            {items.length > 0 ? items.map((elt, index) => {
                                                                return (<Item key={index}
                                                                                source={elt.source}
                                                                                url={elt.url}
                                                                                title={elt.title}
                                                                                author={elt.author}
                                                                                author_avatar={elt.author_avatar}
                                                                                language={elt.language}
                                                                                stars={elt.stars}
                                                                                issues={elt.issues}
                                                                                forks={elt.forks}
                                                                                description={elt.description}/>)
                                                            }) : (<center><h1>No results found !!!</h1></center>)
                            }
                        </div>);
        return (
            <div>
                <center>
                    <div className="Item-List">
                        <div style={{"width":"100%", "textAlign": "left"}}>
                            <span>[+] Showing bests {this.state.count} results for&nbsp; 
                                     {this.props.search.length === 0 ? "'reactJs'": "'"+this.props.search+"'"}
                                     &nbsp;{this.props.language !== "all" ? "{ "+this.props.language+" }": null}.
                            </span>
                        </div>
                        <br/>
                        {this.state.load ? loader : item_list }
                    </div>
                </center>
            </div>
        );
    }
}

export default ItemList;
