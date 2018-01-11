import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ShelfPicker from '../ShelfPicker';
import ShelfActions from '../actions/';

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.handleShelfNavigate = this.handleShelfNavigate.bind(this);
  }
  componentWillUpdate(nextProps) {
    if (!nextProps.authenticated) {
      this.props.shelfActions.authenticate();
    }
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.shelfActions.fetchShelfList(this.props.goodreadsToken);
    }
  }
  componentDidMount() {
    if (!this.props.authenticated) {
      this.props.shelfActions.authenticate();
    } else {
      this.props.shelfActions.fetchShelfList(this.props.goodreadsToken);
    }
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
    shelfList: state.shelfList,
    authenticated: state.auth.authenticated,
    goodreadsToken: state.auth.jwt
  };
};

const mapDispatchToProps = dispatch => {
  return {
    shelfActions: bindActionCreators(ShelfActions, dispatch)
  };
};

HomeScreen = connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

export default HomeScreen;
