import React, { Component } from 'react';
import GoodreadsService from '../GoodreadsService';
import BookSummary from '../components/BookSummary';
import { Link } from 'react-router-dom'
import { apiBaseUrl } from '../config';

function jwtFromUrl(urlString){
  var url = new URL(urlString);
  return url.searchParams.get("jwt");
}

let jwt = jwtFromUrl(window.location.href);

let goodreadsService = new GoodreadsService(jwt, apiBaseUrl)

class ShelfScreen extends Component {
  constructor(props) {
    super(props);

    // initial state
    this.state = {
      books: [],
      currentpage: 1,
      numpages: null,
      isLoading: false
    }

    this.getNextPage = this.getNextPage.bind(this)
  }
  componentDidMount() {
    this.setState({ isLoading: true })
    goodreadsService.getShelf(this.props.match.params.name, 1)
      .then(function(shelf){
        console.log(shelf)
        this.setState({
          books: shelf.books,
          currentpage: shelf.pagination.currentpage,
          numpages: shelf.pagination.numpages,
          isLoading: false
        })
      }.bind(this))
      .catch(function(error){
        this.setState({ isLoading: false })
        if(error.name === "GoodreadsUnauthenticatedException"){
          this.props.history.push('/login')
        } else {
          throw error;
        }
      }.bind(this));
  }
  getNextPage() {
    this.setState({ isLoading: true })
    if(this.state.currentpage >= this.state.numpages){
      return;
    }
    goodreadsService.getShelf(this.props.match.params.name, this.state.currentpage + 1)
      .then(function(shelf){
        console.log(shelf)
        this.setState({
          books: this.state.books.concat(shelf.books),
          currentpage: shelf.pagination.currentpage,
          numpages: shelf.pagination.numpages,
          isLoading: false
        })
      }.bind(this))
      .catch(function(error){
        this.setState({ isLoading: false })
        if(error.name === "GoodreadsUnauthenticatedException"){
          this.props.history.push('/login')
        } else {
          throw error;
        }
      }.bind(this));
  }
  render() {
    let bookSummaries = []
    bookSummaries = this.state.books.map((book) => {
      return <BookSummary key={book.id} book={book}></BookSummary>
    });

    let pagination = <span></span>
    if(this.state.numpages > 1){
      pagination = <span>page {this.state.currentpage} of {this.state.numpages}</span>
    }
    let nextPageButton = '';
    if(this.state.currentpage < this.state.numpages){
      nextPageButton =  <button onClick={this.getNextPage}>Load next page</button>
    }

    return <div>
      <Link to="/">Back</Link>
      <h2>Shelf {this.props.match.params.name}</h2>
      {bookSummaries}
      {this.state.isLoading ? 'LOADING...' : ''}
      {pagination}
      {nextPageButton}
    </div>
  }
}

export default ShelfScreen;