import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

const Tweets = (props) => {
  return (
    <div style={{ width: "100%" }}>
      { (props.currentProfile.tweets === undefined)
        ? <h3>No tweets yet!</h3>
        : (props.currentProfile.tweets.length === 0)
          ? <h3>No tweets yet!</h3>
          : props.currentProfile.tweets.map((tweet, i) => {
            return (
              <div className="tweet-container" key={i}>
                <img src={props.currentProfile.image} alt="current-profile"/>
                <div className="tweet-main">
                  <span>{props.currentProfile.name}</span>
                  <div className="tweet-content">
                    <p>{ tweet.content }</p>
                    {
                      (tweet.likers.includes(props.user.userData._id))
                        ? <div>
                            <Button value="dislike" onClick={e => props.handleLike(tweet._id, e)} className="liked btn-lg">
                              <span style={{ fontSize: "16px" }} >Liked</span> <i className="fas fa-heart"></i>
                            </Button>
                            <p>{tweet.likes}</p>
                          </div>
                        : <div>
                            <Button value="like" onClick={e => props.handleLike(tweet._id, e)} className="like btn-lg">
                              <i className="fas fa-heart"></i>
                            </Button>
                            <p>{tweet.likes}</p>
                          </div>
                    }
                  </div>
                </div>
                <a href={`/profile/${props.currentProfile.name}/status/${tweet._id}`}>
                  <span></span>
                </a>
              </div>
            );
          })
      }
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Tweets);