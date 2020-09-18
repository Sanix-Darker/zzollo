import React, { Component } from 'react';
import './App.css';
import './components/utils/css/grid.css';
import ItemList from './components/ItemList';
import LanguagesOption from './components/utils/js/LanguagesOption';

class App extends Component {

  constructor() {
    super()
    this.state = {
      search: "",
      language: "all",
      sort: "all",
      order: "all",
      go_search: false
    }
  }

  /**
   * 
   * @param {*} event 
   */
  handle_change(event){
    if (event.key === 'Enter')
      this.setState({go_search: true});
    else
      this.setState({go_search: false});

    this.setState({search: event.target.value});
  }

  /**
   * 
   * @param {*} event 
   * @param {*} type 
   */
  handle_change_option(event, type){
    if (type === "lang"){
      this.setState({
        language: event.target.selectedOptions[0].value,
        go_search: true
      });
    }else if (type === "sort"){
      this.setState({
        sort: event.target.selectedOptions[0].value,
        go_search: true
      });
    }else if (type === "order"){
      this.setState({
        order: event.target.selectedOptions[0].value,
        go_search: true
      });
    }
  }

  /**
   * 
   */
  go_search_change(){
    this.setState({
      go_search: !this.state.go_search
    });
  }

  componentDidMount(){

  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <div className="search-box">
            <p className="head">
                <a href="github.com/sanix-darker" title="By Sanix-darker">
                  <img alt="" src="https://avatars1.githubusercontent.com/u/22576758?s=60&v=4" style={{"borderRadius": "100%", "width": "2em"}}/>
                </a>
                <a href="/" style={{"color": "white", "textDecoration": "none"}}><code>Z0l0</code></a>
              <small> Search open-source projects on github / gitlab / bitbucket.
              <a href="https://github.com/sanix-darker/zolo" style={{"color": "white", "float":"right", "textDecoration": "none"}}>[Project-link]</a></small>
            </p>

            <div className="row">
              <div className="col-md-6">
                    <input type="text"
                        className="search-zone"
                        onKeyDown = {(event) => this.handle_change(event)}
                        placeholder="Search keyword(s) for open-source project(s)..."
                        />
                </div>
                <div className="col-md-2">
                    <select className="language-zone"
                            defaultValue="all"
                            onChange = {(event) => this.handle_change_option(event, "lang")}>
                      <option value="all">By languages</option>
                      {LanguagesOption}
                    </select>
                </div>
                <div className="col-md-2">
                    <select className="sort-zone"
                            defaultValue="all"
                            onChange = {(event) => this.handle_change_option(event, "sort")}>
                      <option value="all">By (Stars / Issues / fork)</option>
                      <option value="star">Sort by Stars</option>
                      <option value="issue">Sort by Issues</option>
                      <option value="fork">Sort by Forks</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <select className="order-zone"
                            defaultValue="all"
                            onChange = {(event) => this.handle_change_option(event, "order")}>
                      <option value="all">Filter by (Acsending/Descending))</option>
                      <option value="asc">Ascending order</option>
                      <option value="desc">Descending order</option>
                    </select>
                </div>
              </div>
          </div>
          <br/>
          <ItemList search={this.state.search} 
                    language={this.state.language} 
                    sort={this.state.sort} 
                    order={this.state.order} 
                    go_search={this.state.go_search}/>
        </header>
      </div>
    );
  }
}

export default App;
