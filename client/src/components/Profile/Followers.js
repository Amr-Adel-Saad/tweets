import React, { Component } from 'react';
import { connect } from 'react-redux';

class Followers extends Component {
  constructor(props) {
		super(props);
		this.state = {
			currentProfile: ''
    };
  }
  
  render() {
    return (
      <div style={{ color: "white" }}>
        Followers
      </div>
    );
  }
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Followers);