import React from 'react';
import { connect } from 'react-redux';

const Replies = (props) => {
  if (props.currentTweet.replies !== '') {
    return (
      props.currentTweet.replies.map((reply, i) => (
        <article className="reply-container" key={i}>
          <img src={reply.author.image} alt={reply.author.name} />
          <div className="reply-main">
            <span> {reply.author.name}</span>
            <p>{reply.content}</p>
          </div>
        </article>
      )
      ));
  } else {
    return null;
  }
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Replies);