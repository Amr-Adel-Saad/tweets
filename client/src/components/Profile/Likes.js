import React, { Component } from 'react';
import { connect } from 'react-redux';

class Likes extends Component {
  constructor(props) {
		super(props);
		this.state = {
			currentProfile: ''
    };
  }
  
  render() {
    return (
      <div style={{ color: "white" }}>
        Likes
      </div>
    );
  }
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Likes);