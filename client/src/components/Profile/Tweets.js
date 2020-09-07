import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

const Tweets = (props) => {
  return (
    <div id="profile-tweets">
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
                    <div>
                      <Button className="btn-lg">
                        <i className="fas fa-heart"></i>
                      </Button>
                      <Button className="btn-md">
                        { tweet.likes }
                      </Button>
                    </div>
                  </div>
                </div>
                <a href={`/profile/${props.currentProfile.name}`}>
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