import React, { Component } from 'react';
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router'
import withOfflineState from 'react-offline-hoc';
import './App.css';
import Header from './Header.js'
import localForage from 'localforage';
import HomeScreen from './screens/HomeScreen';
import NoMatchScreen from './screens/NoMatchScreen';
import LoginScreen from './screens/LoginScreen';
import ShelfScreen from './screens/ShelfScreen';
import PrivateRoute from './components/PrivateRoute';
import OfflineBar from './components/OfflineBar';

import { history } from './index';

class App extends Component {
  clearCache(){
    localForage.clear();
  }
  render() {
    return (
      <div className="App">
        <button onClick={this.clearCache}>Clear Cache</button>
         <ConnectedRouter history={history}>
          <div>
            {!this.props.isOnline && <OfflineBar />}
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
        </ConnectedRouter>
      </div>
    );
  }
}

export default withOfflineState(App);
