import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

const Tweets = (props) => {
  return (
    <section>
      { (props.currentProfile.tweets === undefined)
        ? <h3>No tweets yet!</h3>
        : (props.currentProfile.tweets.length === 0)
          ? <h3>No tweets yet!</h3>
          : props.currentProfile.tweets.map((tweet, i) => {
            return (
              <div className="tweet-container" key={i}>
                <img src={props.currentProfile.image} alt="current-profile" />
                <div className="tweet-main">
                  <span> {props.currentProfile.name}</span>
                  <p>{tweet.content}</p>
                  {
                    (tweet.likers.includes(props.user.userData._id))
                      ? <div className="tweet-reactions">
                        <Button value="dislike"
                          onClick={e => props.handleLike(tweet._id, e)}
                          className="liked btn-lg">
                            <span>liked </span>
                          <i className="fas fa-heart"></i>
                        </Button>
                        <Button>{tweet.likes}</Button>
                      </div>
                      : <div className="tweet-reactions">
                        <Button value="like"
                          onClick={e => props.handleLike(tweet._id, e)}
                          className="like btn-lg">
                          <i className="fas fa-heart"></i>
                        </Button>
                        <Button>{tweet.likes}</Button>
                      </div>
                  }
                </div>
                <a href={`/profile/${props.currentProfile.name}/status/${tweet._id}`}>
                  <span></span>
                </a>
              </div>
            );
          })
      }
    </section>
  );
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Tweets);