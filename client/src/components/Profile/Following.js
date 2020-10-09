import React, { Component } from 'react';
import { connect } from 'react-redux';

class Following extends Component {  
  render() {
    return (
      <div>
        Following
      </div>
    );
  }
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Following);