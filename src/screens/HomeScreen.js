import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GoodreadsService from '../GoodreadsService';
import ShelfPicker from '../ShelfPicker';
import { apiBaseUrl } from '../config';
import ShelfActions from '../reducers/actions';

function jwtFromUrl(urlString) {
  var url = new URL(urlString);
  return url.searchParams.get('jwt');
}

let jwt = jwtFromUrl(window.location.href);

let goodreadsService = new GoodreadsService(jwt, apiBaseUrl);

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.handleShelfNavigate = this.handleShelfNavigate.bind(this);
  }
  componentDidMount() {
    this.props.shelfActions.fetchShelfList(goodreadsService);
  }
  handleShelfNavigate(newShelfName) {
    this.props.history.push(`/shelves/${newShelfName}`);
  }
  render() {
    const shelfList = this.props.shelfList;
    return (
      <div>
        <h2>Home</h2>
        {shelfList.error ? (
          <p>{shelfList.error.message}</p>
        ) : (
          <ShelfPicker
            shelves={shelfList}
            handleChange={this.handleShelfNavigate}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    shelfList: state.shelfList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    shelfActions: bindActionCreators(ShelfActions, dispatch)
  };
};

HomeScreen = connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

export default HomeScreen;
