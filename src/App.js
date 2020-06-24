import React, { Component } from 'react';
import './App.css';
import ItemList from './components/ItemList';
import LanguagesOption from './components/LanguagesOption';

class App extends Component {

  constructor() {
    super()
    this.state = {
      search: "",
      language: "all",
      go_search: false
    }
  }

  handle_change(event){

    if (event.key === 'Enter') {
      this.setState({go_search: true});
    }else{
      this.setState({go_search: false});
    }

    this.setState({search: event.target.value});
  }

  handle_change_option(event){
    this.setState({
        language: event.target.selectedOptions[0].value,
        go_search: true
    });
  }

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
              <small> Search open-source projects on github, gitlab and bitbucket.
              <a href="https://github.com/sanix-darker/zolo" style={{"color": "white", "float":"right", "textDecoration": "none"}}>[Github-project-link]</a></small>
            </p>

            <table style={{"width": "100%"}}>
              <tbody>
                <tr>
                  <td style={{"width": "70%"}}>
                    <input type="text"
                        className="search-zone"
                        onKeyDown = {(event) => this.handle_change(event)}
                        placeholder="Search keyword(s) for open-source project(s)..."
                        />
                  </td>
                  <td>
                    <select className="language-zone"
                            defaultValue="all"
                            onChange = {(event) => this.handle_change_option(event)}>
                      <option value="all">All languages</option>
                      {LanguagesOption}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br/>
          <ItemList search={this.state.search} language={this.state.language} go_search={this.state.go_search}/>
        </header>
      </div>
    );
  }
}

export default App;
