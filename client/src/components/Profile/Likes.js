import React, { Component } from 'react';
import { connect } from 'react-redux';

class Likes extends Component {
  constructor(props) {
		super();
		this.state = {
			currentProfile: ''
    };
  }
  
  render() {
    return (
      <div>
        Likes
      </div>
    );
  }
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Likes);