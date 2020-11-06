import React, { Component } from 'react';
import { connect } from 'react-redux';

class Explore extends Component {
  constructor(props) {
    super();
    this.state = {
      trending: []
    }
  }

  render() {
    return (
      <main id="explore" className="col-5-5">
				<div>Trending</div>
			</main>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Explore);
