import React, { Component } from 'react';
import { connect } from 'react-redux';

class Following extends Component {
  constructor(props) {
		super(props);
		this.state = {
			currentProfile: ''
    };
  }
  
  render() {
    return (
      <div style={{ color: "white" }}>
        Following
      </div>
    );
  }
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Following);