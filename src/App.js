import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import Header from './Header.js'
import localForage from 'localforage';
import HomeScreen from './screens/HomeScreen';
import NoMatchScreen from './screens/NoMatchScreen';
import LoginScreen from './screens/LoginScreen';
import ShelfScreen from './screens/ShelfScreen';
import PrivateRoute from './components/PrivateRoute';









class App extends Component {
  clearCache(){
    localForage.clear();
  }
  render() {
    return (
      <div className="App">
        <button onClick={this.clearCache}>Clear Cache</button>
         <Router>
          <div>
            <Header />
            <hr />
            <div>
              <Switch>
                <PrivateRoute exact path="/" component={HomeScreen}/>
                <PrivateRoute path="/shelves/:name" component={ShelfScreen}/>
                <PrivateRoute path="/shelves" component={HomeScreen}/>
                <Route path="/login" component={LoginScreen}/>
                <Route component={NoMatchScreen}/>
              </Switch>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
