import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

const Like = (props) => {
  if (props.tweet.likers.includes(props.user.userData._id)) {
    return (
      <div className="tweet-reactions">
        <Button value="dislike"
          onClick={e => props.handleLike(props.tweet._id, e)}
          className="liked btn-lg">
          <span>liked </span>
          <i className="fas fa-heart"></i>
        </Button>
        <Button>{props.tweet.likes}</Button>
      </div>
    );
  } else {
    return (
      <div className="tweet-reactions">
        <Button value="like"
          onClick={e => props.handleLike(props.tweet._id, e)}
          className="like btn-lg">
          <i className="fas fa-heart"></i>
        </Button>
        <Button>{props.tweet.likes}</Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Like);
