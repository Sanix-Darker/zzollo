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
      this.setState(
        {
          go_search: true
        }
      );
    }

    this.setState({search: event.target.value});
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
