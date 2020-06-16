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
                "gitlab": "",
                "bitbucket": ""
            },
            items: [],
            count: 0
        }
    }

    fetch_projects = (type, search) => {

        fetch(this.state.links[type]["link"] + search)
        .then(async response => {
            const resData = await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response statusText
                const error = (resData && resData.message) || response.statusText;
                return Promise.reject(error);
            }
           
            const count = resData["total_count"];
            this.setState({
             count: this.state.count + count
            });
            let items = []
 
            const github = this.state.links[type];
 
            resData["items"].map((elt, index) => {
                const author = github["author"].split("|");
                const author_avatar = github["author_avatar"].split("|");
 
                 items.push({
                     "index": index,
                     "title": elt[github["name"]],
                     "url": elt[github["html_url"]],
                     "author": elt[author[0]][author[1]],
                     "author_avatar":  elt[author_avatar[0]][author_avatar[1]],
                     "stars": elt[github["stars"]],
                     "forks": elt[github["forks"]],
                     "issues": elt[github["issues"]],
                     "language": elt[github["language"]],
                     "description": elt[github["description"]]
                 });
                 return true;
            })
 
            this.setState({ items: items }); //this is an asynchronous function
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
;
    }

    componentWillReceiveProps = (nextProps) => {
    
        if (nextProps.go_search === true){
            console.log("Start-Fetching...")
            this.fetch_projects("github", "reactjs");
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
                        <div style={{"width":"100%", "text-align": "left"}}>
                            <span>{this.state.count} results.</span>
                        </div>
                        <br/>
                        {this.state.items.map((elt, index) => {
                            return (<Item key={index}
                                            url={elt.url}
                                            title={elt.title}
                                            author={elt.author}
                                            language={elt.language}
                                            stars={elt.stars}
                                            issues={elt.issues}
                                            forks={elt.forks}
                                            description={elt.description}/>);
                        })}
                    </div>
                </center>
            </div>
        );
    }
}

export default ItemList
