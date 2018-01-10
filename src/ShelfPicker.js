import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ShelfPicker extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.props.handleChange(event.target.value);
  }
  render() {
    if (this.props.shelves.loading) {
      return <span>Loading shelves...</span>;
    }
    const shelfOptions = this.props.shelves.items.map(shelf => {
      let bookCountText = '';
      if (shelf.book_count > 0) {
        bookCountText = `(${shelf.book_count} books)`;
      }
      return (
        <option key={shelf.id} value={shelf.name}>
          {shelf.name} {bookCountText}
        </option>
      );
    });
    return (
      <div>
        <label htmlFor="shelf-picker">Select a shelf to browse:</label>
        <select
          name="shelf-picker"
          id="shelf-picker"
          onChange={this.handleChange}
        >
          <option value="" />
          {shelfOptions}
        </select>
      </div>
    );
  }
}

ShelfPicker.propTypes = {
  shelves: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ShelfPicker;
