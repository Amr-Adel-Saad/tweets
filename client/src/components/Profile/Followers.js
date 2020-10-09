import React, { Component } from 'react';
import { connect } from 'react-redux';

class Followers extends Component {
  render() {
    return (
      <div>
        Followers
      </div>
    );
  }
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Followers);