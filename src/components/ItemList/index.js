import React, {Component} from 'react';
import './ItemList.css';
import Item from '../Item';
import { linkSelector } from '../utils/js/Selectors'
// import axios from 'axios';

class ItemList extends Component {

    constructor() {
        super()
        this.state = {
            precedentSearch: "",
            links: linkSelector,
            items: [],
            itemsOrig: [],
            load: true,
            count: 0
        }
    }

    /**
     * 
     * @param {*} items 
     * @param {*} source 
     * @param {*} resData 
     * @param {*} source_object 
     */
    pushNewItems(items, source, resData, source_object) {
        resData.map((elt, index) => {
            const author = source_object["author"].split("|");
            const author_avatar = source_object["author_avatar"].split("|");

            if (source === "github" || source === "bitbucket"){
                items.push({
                    "index": index,
                    "source": source,
                    "title": elt[source_object["name"]],
                    "url": elt[source_object["html_url"]],
                    "author": elt[author[0]][author[1]],
                    "author_avatar": elt[author_avatar[0]][author_avatar[1]],
                    "stars": parseInt(elt[source_object["stars"]]),
                    "forks": parseInt(elt[source_object["forks"]]),
                    "issues": parseInt(elt[source_object["issues"]]),
                    "language": elt[source_object["language"]],
                    "description": elt[source_object["description"]]
                });
            }else if (source === "gitlab"){
                let avatar=""; 
                if (typeof(elt[author_avatar[0]][author_avatar[1]]) != "undefined" && 
                    elt[author_avatar[0]][author_avatar[1]] != null){
                        avatar = (elt[author_avatar[0]][author_avatar[1]].indexOf("http") === -1) ?
                                    "https://gitlab.com" + elt[author_avatar[0]][author_avatar[1]] : 
                                    elt[author_avatar[0]][author_avatar[1]];
                }
                items.push({
                    "index": index,
                    "source": source,
                    "title": elt[source_object["name"]],
                    "url": elt[source_object["html_url"]],
                    "author": elt[author[0]][author[1]],
                    "author_avatar": avatar,
                    "stars": parseInt(elt[source_object["stars"]]),
                    "forks": parseInt(elt[source_object["forks"]]),
                    "issues": 0,
                    "language": "-",
                    "description": elt[source_object["description"]]
                });
            }

            return true;
        });
        // perform a sort
        items.sort((a, b) => a.stars - b.stars).reverse();
        this.setState({
            load: false,
            items: items,
            itemsOrig: items,
            count: items.length
        });
        return items;
    }

    /**
     * 
     * @param {*} items 
     * @param {*} source 
     * @param {*} search 
     * @param {*} page 
     */
    getresults(items, source, search, page){
        return new Promise((resolve, reject) =>{
            const linkToFetch = this.state.links[source]["link"] + search;

            fetch((source === "github" || source === "gitlab") ? linkToFetch + "&page=" + page + "&per_page=100" : linkToFetch)
            .then(async response => {
                const resData = await response.json();
                const source_object = this.state.links[source];
                
                items = this.pushNewItems(items, 
                    source, 
                    (source === "github" ? resData["items"] : source === "bitbucket" ? resData["values"] : resData), 
                    source_object
                );
                resolve(items);
            }).catch(error => {
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
        });
    }

    /**
     * 
     * @param {*} search 
     */
    fetch_projects = (search) => {
        search = search.toLowerCase();
        let items = [];

        this.getresults(items, "github", search, 1).then((returned_items) => {
            this.getresults(returned_items, "gitlab", search, 1).then((returned_items2) => {
                this.getresults(returned_items2, "bitbucket", search, 1).then((res) => {
                    console.log("[+] Fetches ended !");
                })
            });
        });
    }


    componentWillReceiveProps = (nextProps) => {
        if (nextProps.go_search === true){

            if (nextProps.search !== this.state.precedentSearch){
                this.setState({
                    precedentSearch: nextProps.search,
                    items: [],
                    itemsOrig: [],
                    load: true
                });
                this.fetch_projects(nextProps.search);
            }

            if (nextProps.source !== "all"){
                this.setState({
                    items: this.state.itemsOrig.filter(elt => {
                        return (elt["source"] !== null) ? (elt["source"].toLowerCase() === nextProps.source.toLowerCase()) : null
                    }),
                });
            }else{
                this.setState({
                    items: this.state.itemsOrig,
                });
            }

            if (nextProps.language !== "all"){
                this.setState({
                    items: this.state.itemsOrig.filter(elt => {
                        return (elt["language"] !== null) ? (elt["language"].toLowerCase() === nextProps.language.toLowerCase()) : null
                    }),
                });
            }

            if (nextProps.sort !== "all"){
                if (nextProps.sort === "star"){
                    if (nextProps.order === "desc"){
                        this.setState({
                            items: this.state.itemsOrig.sort((a, b) => a.stars - b.stars).reverse(),
                        });
                    }else{
                        this.setState({
                            items: this.state.itemsOrig.sort((a, b) => a.stars - b.stars),
                        });
                    }
                }
                else if (nextProps.sort === "fork"){
                    if (nextProps.order === "desc"){
                        this.setState({
                            items: this.state.itemsOrig.sort((a, b) => a.forks - b.forks).reverse(),
                        });
                    }else{
                        this.setState({
                            items: this.state.itemsOrig.sort((a, b) => a.forks - b.forks),
                        });
                    }
                }
                else if (nextProps.sort === "issue"){
                    if (nextProps.order === "desc"){
                        this.setState({
                            items: this.state.itemsOrig.sort((a, b) => a.issues - b.issues).reverse(),
                        });
                    }else{
                        this.setState({
                            items: this.state.itemsOrig.sort((a, b) => a.issues - b.issues),
                        });
                    }
                }
            }
        }
    }

    componentDidMount(){
        this.setState({ items: [] });
        if (this.props.search !== '' && this.props.go_search === true){
            this.fetch_projects(this.props.search);
        }
    }

    /**
     * 
     * @param {*} items 
     * @param {*} param1 
     */
    filterItemsByLanguage(items, { language: selectedLanguage }) {
        if (selectedLanguage === "all") {
            return items;
        }

        return items.filter(elt => {
            const language = elt && elt["language"];
            return language?.toLowerCase() === selectedLanguage?.toLowerCase();
        });
    }

    /**
     * 
     */
    getItemsComponents(){
        const items = this.filterItemsByLanguage(this.state.items, this.props);
        return (<div style={{"display": "flex", "flexWrap": "wrap","justifyContent":"space-around"}}>
                            {items.length > 0 ? 
                                items.map(
                                    (elt, index) => {
                                        return (<Item key={index}
                                                        source={elt.source} url={elt.url}
                                                        title={elt.title} author={elt.author}
                                                        author_avatar={elt.author_avatar} language={elt.language}
                                                        stars={elt.stars} issues={elt.issues}
                                                        forks={elt.forks} description={elt.description}/>)
                                    }) : 
                                (<center>
                                    <h1>No results found !!!</h1>
                                </center>)
                            }
                        </div>);
    }

    render() {
        return (
            <div>
                <center>
                    <div className="Item-List">
                        <div style={{"width":"100%", "textAlign": "center"}}>
                            <span>[+] Showing bests {this.state.count} results for&nbsp; 
                                     {this.props.search.length === 0 ? "''": "'"+this.props.search+"'"}
                                     &nbsp;{this.props.language !== "all" ? "{ "+this.props.language+" }": null}.
                            </span>
                        </div>
                        <br/>
                        
                        {
                            ((this.props.search === '' || this.props.go_search === false) && this.state.load) ? 
                                (<div>
                                    <img src="https://media1.tenor.com/images/551d452e9eb7377fd4d189bf905a61f3/tenor.gif?itemid=5588862" 
                                                style={{maxWidth: "100%", borderRadius: "100%", boxShadow: "0 3px 7px rgba(0,0,0,0.54)"}} alt=""/>
                                </div>) :
                                (this.state.load ? 
                                    (<img src="/loading.gif" alt=""/>) 
                                    : this.getItemsComponents())
                        }
                    </div>
                </center>
            </div>
        );
    }
}

export default ItemList;
