import React, { Component } from 'react';
import GoodreadsService from '../GoodreadsService';
import BookSummary from '../components/BookSummary';
import { Link } from 'react-router-dom';
import { apiBaseUrl } from '../config';
import ShelfActions from '../reducers/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { onLastPageOfShelf, isLoadingShelf } from '../reducers';

function jwtFromUrl(urlString) {
  var url = new URL(urlString);
  return url.searchParams.get('jwt');
}

let jwt = jwtFromUrl(window.location.href);

let goodreadsService = new GoodreadsService(jwt, apiBaseUrl);

class ShelfScreen extends Component {
  constructor(props) {
    super(props);

    this.getNextPage = this.getNextPage.bind(this);
  }
  componentDidMount() {
    let shelfName = this.props.match.params.name;
    this.props.shelfActions.fetchShelf(goodreadsService, shelfName, 1);
  }
  getNextPage() {
    if (this.props.onLastPageOfShelf) {
      return;
    }
    let shelfName = this.props.match.params.name;
    let pageToFetch = this.props.shelves[shelfName].pagination.currentPage + 1;
    this.props.shelfActions.fetchShelf(
      goodreadsService,
      shelfName,
      pageToFetch
    );
  }
  _renderPages() {
    let shelfName = this.props.match.params.name;
    let shelf = this.props.shelves[shelfName];
    if (!shelf) {
      return null;
    }
    return Object.entries(shelf.pagination.pages).map(([pageNum, page]) => {
      return (
        <div key={`page_${pageNum}`} className="Shelf__page">
          {page.ids.map(id => {
            let book = shelf.books[id];
            return <BookSummary key={book.id} book={book} />;
          })}
        </div>
      );
    });
  }
  _renderPagination() {
    let shelfName = this.props.match.params.name;
    let shelf = this.props.shelves[shelfName];
    if (!shelf) {
      return null;
    }
    let pagination = null;
    if (shelf.pagination.totalPages > 1) {
      pagination = (
        <span className="Shelf__pagination">
          showing {Object.keys(shelf.books).length} of {shelf.totalBooks} books
          | (page {shelf.pagination.currentPage} of{' '}
          {shelf.pagination.totalPages})
        </span>
      );
    }
    return pagination;
  }
  _renderNextPageButton() {
    let shelfName = this.props.match.params.name;
    let shelf = this.props.shelves[shelfName];
    if (!shelf) {
      return null;
    }
    let atEnd = this.props.onLastPageOfShelf;
    // shelf.pagination.currentPage >= shelf.pagination.totalPages &&
    // !shelf.pagination.pages[shelf.pagination.currentPage].loading;
    let nextPage = shelf.pagination.pages[shelf.pagination.currentPage + 1];
    let isLoading = this.props.loading;
    let buttonText = 'Load more';
    if (atEnd) {
      buttonText = 'You have reached the end';
    }
    if (isLoading) {
      buttonText = 'Loading';
    }

    return (
      <button
        className="Shelf__load-more-button"
        onClick={this.getNextPage}
        disabled={atEnd || isLoading}
      >
        {buttonText}
      </button>
    );
  }
  _renderEmptyState() {
    return 'This shelf has no books.';
  }
  _renderContent() {
    let shelfName = this.props.match.params.name;
    let shelf = this.props.shelves[shelfName];
    let isEmpty = shelf && shelf.totalBooks !== null && shelf.totalBooks < 1;
    return (
      <div>
        {isEmpty && this._renderEmptyState()}
        {this._renderPages()}
        {this._renderPagination()}
        {shelf && !isEmpty && this._renderNextPageButton()}
      </div>
    );
  }

  render() {
    let shelfName = this.props.match.params.name;

    return (
      <div className="Shelf">
        <Link to="/">Back</Link>
        <h2>Shelf "{shelfName}"</h2>
        {this._renderContent()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let shelfName = ownProps.match.params.name;
  let shelf = state.shelves[shelfName];
  return {
    shelfList: state.shelfList,
    shelves: state.shelves,
    shelfName,
    shelf: shelf,
    onLastPageOfShelf: onLastPageOfShelf(state, shelfName),
    loading: isLoadingShelf(shelf)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    shelfActions: bindActionCreators(ShelfActions, dispatch)
  };
};

ShelfScreen = connect(mapStateToProps, mapDispatchToProps)(ShelfScreen);

export default ShelfScreen;
