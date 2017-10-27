import React, { Component } from 'react';
import GoodreadsService from '../GoodreadsService';
import ShelfPicker from '../ShelfPicker';
import { apiBaseUrl } from '../config';


function jwtFromUrl(urlString){
  var url = new URL(urlString);
  return url.searchParams.get("jwt");
}

let jwt = jwtFromUrl(window.location.href);

let goodreadsService = new GoodreadsService(jwt, apiBaseUrl)


export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    // console.log(props)
    this.handleShelfNavigate = this.handleShelfNavigate.bind(this);

    // initial state
    this.state = {
      shelves: []
    }
  }
  componentDidMount() {
    goodreadsService.getShelves()
      .then(function(shelves){
        console.log(shelves)
        this.setState({
          shelves
        })
      }.bind(this))
      .catch(function(error){
        if(error.name === "GoodreadsUnauthenticatedException"){
          this.props.history.push('/login')
        } else {
          throw error;
        }
      }.bind(this));
  }
  handleShelfNavigate(newShelfName) {
    // alert(newShelfName);
    this.props.history.push(`/shelves/${newShelfName}`)
  }
  render() {
    return <div>
      <h2>Home</h2>
      <ShelfPicker shelves={this.state.shelves} handleChange={this.handleShelfNavigate}></ShelfPicker>
    </div>
  }
}