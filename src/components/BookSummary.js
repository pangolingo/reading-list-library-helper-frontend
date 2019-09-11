import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BookSummary extends Component {
  render() {
    let book = this.props.book;
    let authors = book.authors
      .reduce((sum, author) => {
        return `${sum}, ${author.name}`;
      }, '')
      .slice(2);
    let catalogTitleUrl = `https://ropl.ent.sirsi.net/client/default/search/results?dt=list&t%3Aformdata=&qu=${encodeURIComponent(
      book.title_without_series
    )}&rt=false%7C%7C%7CTITLE%7C%7C%7CTitle`;
    let catalogAuthorUrl = `https://ropl.ent.sirsi.net/client/default/search/results?dt=list&t%3Aformdata=&qu=${encodeURIComponent(
      authors
    )}&rt=false%7C%7C%7CAUTHOR%7C%7C%7CAuthor`;
    return (
      <div className="BookSummary">
        <div className="BookSummary_left-col">
          <img
            src={book.small_image_url}
            alt={book.title}
            className="BookSummary__image"
          />
          <button
            className="BookSummary__favorite_button"
            onClick={this.props.handleFavoriteToggle}
          >
            {this.props.isFavorite ? 'Unstar' : 'Star'}
          </button>
        </div>
        <div className="BookSummary_right-col">
          <h2 className="BookSummary__title">{book.title}</h2>
          <span className="BookSummary__authors">{authors}</span>
          <br />
          <a href={catalogTitleUrl} target="_blank" rel="noopener noreferrer">
            Find title in Rochester Library
          </a>
          <br />
          <a href={catalogAuthorUrl} target="_blank" rel="noopener noreferrer">
            Find author in Rochester Library
          </a>
        </div>
      </div>
    );
  }
}

BookSummary.propTypes = {
  book: PropTypes.shape({
    authors: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
    small_image_url: PropTypes.string,
    title_without_series: PropTypes.string
  })
};

export default BookSummary;
