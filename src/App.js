import React from 'react';
import './App.css';
import ItemList from './components/ItemList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="search-box">
          <p className="head">
            <code>Z0l0</code>
            <small> Search open-source projects on github, gitlab, bitbucket, phabricator and launchpad at the same time in one place...</small>
          </p>
          
          <input type="text" className="search-zone" placeholder="Search a keyword for an open-source project..."/>
        </div>

        <ItemList />
      </header>
    </div>
  );
}

export default App;
