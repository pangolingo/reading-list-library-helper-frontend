import React, { Component } from 'react';
import GoodreadsService from '../GoodreadsService';
import BookSummary from '../components/BookSummary';
import { Link } from 'react-router-dom'
import { apiBaseUrl } from '../config';
import ShelfActions from '../reducers/actions';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

function jwtFromUrl(urlString){
  var url = new URL(urlString);
  return url.searchParams.get("jwt");
}

let jwt = jwtFromUrl(window.location.href);

let goodreadsService = new GoodreadsService(jwt, apiBaseUrl)

class ShelfScreen extends Component {
  constructor(props) {
    super(props);

    this.getNextPage = this.getNextPage.bind(this)
  }
  componentDidMount() {
    let shelfName = this.props.match.params.name;
    this.props.shelfActions.fetchShelf(goodreadsService, shelfName, 1);
  }
  getNextPage() {
    let shelfName = this.props.match.params.name;
    let pageToFetch = this.props.shelves[shelfName].pagination.currentPage + 1;
    this.props.shelfActions.fetchShelf(goodreadsService, shelfName, pageToFetch);
  }
  _renderLoadingState() {
    return <span>LOADING...</span>;
  }
  _renderPages() {
    let shelfName = this.props.match.params.name;
    let shelf = this.props.shelves[shelfName];
    if(!shelf) {
      return null;
    }
    return Object.entries(shelf.pagination.pages).map(([pageNum, page]) => {
      let isLoading = page.loading;
      return <div key={`page_${pageNum}`}>
        <h2>Page {pageNum}</h2>
        {isLoading ? 'LOADING...' : ''}
        {page.ids.map((id) => {
          let book = shelf.books[id];
          return <BookSummary key={book.id} book={book}></BookSummary>;
        })}
      </div>
    });
  }
  _renderPagination() {
    let shelfName = this.props.match.params.name;
    let shelf = this.props.shelves[shelfName];
    if(!shelf) {
      return null;
    }
    let pagination = null;
    if(shelf.pagination.totalPages > 1){
      pagination = <span>page {shelf.pagination.currentPage} of {shelf.pagination.totalPages}</span>
    }
    return pagination;
  }
  _renderNextPageButton() {
    let shelfName = this.props.match.params.name;
    let shelf = this.props.shelves[shelfName];
    if(!shelf) {
      return null;
    }
    let nextPageButton = null;
    if(shelf.pagination.currentPage < shelf.pagination.totalPages){
      nextPageButton =  <button onClick={this.getNextPage} disabled={shelf.pagination.pages[shelf.pagination.currentPage+1] && shelf.pagination.pages[shelf.pagination.currentPage+1].loading}>Load next page</button>
    }
    return nextPageButton;
  }
  _renderEmptyState() {
    return 'This shelf has no books.';
  }
  _renderContent() {
    let shelfName = this.props.match.params.name;
    let shelf = this.props.shelves[shelfName];
    let isEmpty = shelf && shelf.totalBooks !== null && shelf.totalBooks < 1;
    return <div>
      {!shelf && this._renderLoadingState()}
      {isEmpty && this._renderEmptyState()}
      {this._renderPages()}
      {this._renderPagination()}
      {this._renderNextPageButton()}
    </div>
  }

  render() {
    let shelfName = this.props.match.params.name;

    return <div>
      <Link to="/">Back</Link>
      <h2>Shelf "{shelfName}"</h2>
      {this._renderContent()}
    </div>
  }
}

const mapStateToProps = state => {
  return {
    shelfList: state.shelfList,
    shelves: state.shelves,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    shelfActions: bindActionCreators(ShelfActions, dispatch),
  }
}

ShelfScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShelfScreen)

export default ShelfScreen