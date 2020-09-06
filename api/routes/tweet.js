const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const Tweet = require('../models/Tweet');
const User = require('../models/User');

// Post tweet
router.post('/', checkAuth, (req, res) => {
  const { content, author } = req.body;

  if (author === req.userData.userId) {
    const newTweet = Tweet({
      content,
      author
    });
  
    newTweet.save()
      .then(saved => {
        User.updateOne(
          { _id: author }, 
          { $push: { tweets: saved._id } }).exec()
          .then(() => res.status(200).json({ message: 'Tweet saved' }))
          .catch(err => res.status(500).json({ error: err }));
        })
      .catch(err => res.status(500).json({ error: err }));
  } else {
    return res.status(401).json({ message: 'Auth failed' });
  }
});

// Get tweet
router.get('/:tweetId', (req, res) => {
  Tweet.findOne({ _id: req.params.tweetId }).exec()
    .then(tweet => {
      if (tweet) {
        return res.status(200).json(tweet);
      } else {
        return res.status(404).json({ message: 'Tweet not found' });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
});

// Get most liked
router.get('/trending', (req, res) => {
  Tweet.find()
  .sort({ likes: -1 })
  .limit(10)
    .then(tweets => {
      if (tweets) {
        return res.status(200).json(tweets);
      } else {
        return res.status(204).json({ message: 'No tweets available' });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
});

// Patch tweet
router.patch('/:tweetId', (req, res) => {
  if (req.body.type === 'like') {
    Tweet.updateOne(
      { _id: req.params.tweetId },
      { "$addToSet": { "likers": req.body.id },
        "$inc": { "likes": 1 } }).exec()
      .then(tweet => res.status(200).json(tweet))
      .catch(err => res.status(500).json({ error: err }));
  } else if (req.body.type === 'unlike') {
    Tweet.updateOne(
      { _id: req.params.tweetId },
      { "$pull": { "likers": req.body.id },
        "$inc": { "likes": -1 } }).exec()
      .then(tweet => res.status(200).json(tweet))
      .catch(err => res.status(500).json({ error: err }));
  } else {
    return res.status(400).json({ message: 'Bad request' });
  }
});

// Delete tweet
router.delete('/:tweetId', checkAuth, (req, res) => {
  if (req.body.userId === req.userData.userId) {
		Tweet.deleteOne({ _id: req.params.tweetId }).exec()
			.then(() => res.status(200).json({ message: 'Tweet deleted' }))
			.catch(err => res.status(500).json({ error: err }));
	} else {
		res.status(401).json({ message: 'Auth failed' });
	}
});

module.exports = router;