import React, {Component} from 'react';
import './ItemList.css';
import Item from './Item';

// import axios from 'axios';

class ItemList extends Component {

    constructor() {
        super()
        this.state = {
            links:{
                "github": {
                    "link": "https://api.github.com/search/repositories?sort=stars&q=",
                    "count": "total_count",
                    "items": "items",
                    "author": "owner|login",
                    "author_avatar": "owner|avatar_url",
                    "name": "name",
                    "full_name": "full_name",
                    "stars": "stargazers_count",
                    "language": "language",
                    "forks": "forks",
                    "issues": "open_issues",
                    "html_url": "html_url",
                    "description": "description"
                },
                "gitlab": {
                    "link": "https://gitlab.com/api/v4/projects?search=",
                    "count": "",
                    "items": "",
                    "author": "namespace|name",
                    "author_avatar": "namespace|avatar_url",
                    "name": "name",
                    "full_name": "name_with_namespace",
                    "stars": "star_count",
                    "language": "",
                    "forks": "forks_count",
                    "issues": "",
                    "html_url": "web_url",
                    "description": "description"
                },
                "bitbucket": ""
            },
            items: [],
            count: 0
        }
    }

    fetch_projects = (search) => {
        this.setState({ items: [] });
        
        let source = "github";
        fetch(this.state.links[source]["link"] + search)
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
                 
            });

            source = "gitlab";

            fetch(this.state.links[source]["link"] + search)
            .then(async response => {
                resData = await response.json();

                source_object = this.state.links[source];
                
                resData.map((elt, index) => {
                    const author = source_object["author"].split("|");
                    const author_avatar = source_object["author_avatar"].split("|");
     
                     items.push({
                         "index": index,
                         "source": source,
                         "title": elt[source_object["name"]],
                         "url": elt[source_object["html_url"]],
                         "author": elt[author[0]][author[1]],
                         "author_avatar": "https://gitlab.com" + elt[author_avatar[0]][author_avatar[1]],
                         "stars": parseInt(elt[source_object["stars"]]),
                         "forks": elt[source_object["forks"]],
                         "issues": "-",
                         "language": "-",
                         "description": elt[source_object["description"]]
                     });
               });
               
               this.setState({
                   items: items,
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
            console.log("Start-Fetching...")

            this.fetch_projects("github", nextProps.search);
        }else{
            console.log("Text keyword(s)");
        }
    }

    componentDidMount(){
        this.fetch_projects("github", "reactjs");
    }

    render() {
        return (
            <div>
                <center>
                    <div className="Item-List">
                        <div style={{"width":"100%", "textAlign": "left"}}>
                            <span>{this.state.count} results.</span>
                        </div>
                        <br/>
                        <div style={{"display": "flex", "flexWrap": "wrap"}}>
                            {this.state.items.map((elt, index) => {
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
                                                description={elt.description}/>);
                            })}
                        </div>
                    </div>
                </center>
            </div>
        );
    }
}

export default ItemList
