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
              <div style={{ display: "flex", justifyContent: "space-between" }} key={i}>
                <img style={{ width: "60px", height: "60px" }} src={props.currentProfile.image} alt="current-profile"/>
                <span>{props.currentProfile.name}</span>
                <p>{ tweet.content }</p>
                { tweet.likes.length }
                <Button color="primary">Follow</Button>
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