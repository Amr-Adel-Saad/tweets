import React, { Component } from 'react';
import { connect } from 'react-redux';

class Tweets extends Component {
  constructor(props) {
		super(props);
		this.state = {
			currentProfile: ''
    };
  }
  
  render() {
    return (
      <div style={{ color: "white" }}>
        Tweets
      </div>
    );
  }
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Tweets);