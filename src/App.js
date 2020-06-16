import React, { Component } from 'react';
import './App.css';
import ItemList from './components/ItemList';

class App extends Component {

  constructor() {
    super()
    this.state = {
      search: "",
      go_search: false
    }
  }

  handle_change(event){

    if (event.key === 'Enter') {
      console.log('>> Enter have been pressed !!!');
      this.setState({go_search: true});
    }else{
      this.setState({go_search: false});
    }

    this.setState({search: event.target.value});
  }

  go_search_change(){
    console.log("Rechange-go_search");

    this.setState({
      go_search: !this.state.go_search
    });
  }

  search_query = (query) => {

  }

  componentDidMount(){

  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <div className="search-box">
            <p className="head">
              <code>Z0l0</code>
              <small> Search open-source projects on github, gitlab and bitbucket at the same time in one place...</small>
              <span className="Author">
                <a href="github.com/sanix-darker" title="By Sanix-darker">
                  <img alt="" src="https://avatars0.githubusercontent.com/u/22576758?v=4" />
                </a>
              </span>
            </p>
            
            <input type="text"
                    className="search-zone"
                    onKeyDown = {(event) => this.handle_change(event)}
                    placeholder="Search keyword(s) for open-source project(s)..."
                    />
          </div>

          <ItemList search={this.state.search} go_search={this.state.go_search}/>
        </header>
      </div>
    );
  }
}

export default App;
