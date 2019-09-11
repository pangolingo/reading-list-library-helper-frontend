import React, { Component } from 'react';
import _ from 'underscore';
import BookSummary from '../components/BookSummary';
import { Link } from 'react-router-dom';
import withOfflineState from 'react-offline-hoc';
import ShelfActions from '../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { onLastPageOfShelf, isLoadingShelf } from '../reducers/ShelvesReducer';

class ShelfScreen extends Component {
  constructor(props) {
    super(props);

    this.getNextPage = this.getNextPage.bind(this);
    this.handleFavoriteToggle = this.handleFavoriteToggle.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }
  componentWillUpdate(nextProps) {
    if (!nextProps.authenticated) {
      this.props.shelfActions.authenticate();
    }
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.fetchData();
    }

    // we came online: fetch the latest shelf data
    if (!prevProps.isOnline && this.props.isOnline) {
      this.fetchData();
    }
  }
  componentDidMount() {
    if (!this.props.authenticated) {
      this.props.shelfActions.authenticate();
    } else {
      this.fetchData();
    }
  }
  fetchData() {
    let shelfName = this.props.match.params.name;
    this.props.shelfActions.fetchShelf(
      this.props.goodreadsToken,
      shelfName,
      1,
      this.props.isOnline
    );
  }
  getNextPage() {
    if (this.props.onLastPageOfShelf) {
      return;
    }
    let shelfName = this.props.match.params.name;
    let pageToFetch = this.props.shelves[shelfName].pagination.currentPage + 1;
    this.props.shelfActions.fetchShelf(
      this.props.goodreadsToken,
      shelfName,
      pageToFetch
    );
  }
  handleFavoriteToggle(bookId) {
    let shelfName = this.props.match.params.name;
    console.log('favoriting', bookId);
    this.props.shelfActions.toggleFavoriteBook(shelfName, bookId);
  }
  _renderPages() {
    let shelfName = this.props.match.params.name;
    let shelf = this.props.shelves[shelfName];
    if (!shelf) {
      return null;
    }
    return _.map(shelf.pagination.pages, (page, pageNum) => {
      return (
        <div key={`page_${pageNum}`} className="Shelf__page">
          {page.ids.map(id => {
            let book = shelf.books[id];
            const isFavorite = shelf.favorites.includes(id);
            return (
              <BookSummary
                key={book.id}
                book={book}
                isFavorite={isFavorite}
                handleFavoriteToggle={this.handleFavoriteToggle.bind(
                  this,
                  book.id,
                  isFavorite
                )}
              />
            );
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
          showing {_.size(shelf.books)} of {shelf.totalBooks} books | (page{' '}
          {shelf.pagination.currentPage} of {shelf.pagination.totalPages})
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
        <a href="#top">Back to the top</a>
      </div>
    );
  }

  render() {
    let shelfName = this.props.match.params.name;
    let shelf = this.props.shelves[shelfName];
    return (
      <div className="Shelf">
        <Link to="/">Back</Link>
        <h2 className="Shelf__title">Shelf "{shelfName}"</h2>
        {!shelf && <p>Error loading shelf.</p>}
        {shelf && shelf.error ? (
          <p>{shelf.error.message}</p>
        ) : (
          this._renderContent()
        )}
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
    loading: isLoadingShelf(shelf),
    authenticated: state.auth.authenticated,
    goodreadsToken: state.auth.jwt
  };
};

const mapDispatchToProps = dispatch => {
  return {
    shelfActions: bindActionCreators(ShelfActions, dispatch)
  };
};

ShelfScreen = connect(mapStateToProps, mapDispatchToProps)(
  withOfflineState(ShelfScreen)
);

export default ShelfScreen;
