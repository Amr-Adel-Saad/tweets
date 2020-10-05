const express = require('express');
const router = express.Router();

// User checkAuth middleware
const checkAuth = require('../middleware/check-auth');

// User, Tweet, Reply model
const User = require('../models/User');
const Tweet = require('../models/Tweet');
const Reply = require('../models/Reply');

// Post tweet
router.post('/', checkAuth, (req, res) => {
  const newTweet = Tweet({
    content: req.body.content,
    author: req.userData.userId
  });

  newTweet.save()
    .then(saved => {
      User.updateOne(
        { _id: req.userData.userId },
        {
          $push: {
            tweets: {
              $each: [saved._id],
              $position: 0
            }
          }
        }).exec()
        .then(() => res.status(200).json(saved))
        .catch(err => res.status(500).json({ error: err }));
    })
    .catch(err => res.status(500).json({ error: err }));
});

// Get tweet
router.get('/:tweetId', (req, res) => {
  Tweet.findOne({ _id: req.params.tweetId })
    .populate('author', 'name image')
    .populate({
      path: 'replies',
      populate: {
        path: 'author',
        select: 'name image'
      }
    }).exec()
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
router.patch('/:tweetId', checkAuth, (req, res) => {
  // Like tweet
  if (req.body.type === 'like') {
    Tweet.updateOne(
      { _id: req.params.tweetId },
      {
        $addToSet: { 'likers': req.userData.userId },
        $inc: { 'likes': 1 }
      }).exec()
      .then(() => res.status(200).json({ message: 'Tweet liked' }))
      .catch(err => res.status(500).json({ error: err }));
  } else if (req.body.type === 'dislike') {
    // Dislike tweet
    Tweet.updateOne(
      { _id: req.params.tweetId },
      {
        $pull: { 'likers': req.userData.userId },
        $inc: { 'likes': -1 }
      }).exec()
      .then(() => res.status(200).json({ message: 'Tweet disliked' }))
      .catch(err => res.status(500).json({ error: err }));
  } else {
    res.status(400);
  }
});

// Post reply
router.post('/:tweetId/reply', checkAuth, (req, res) => {
  const newReply = Reply({
    content: req.body.content,
    author: req.userData.userId
  });

  newReply.save()
    .then(saved => {
      User.updateOne(
        { _id: req.body._id },
        {
          $push: {
            'replies': [saved._id],
          }
        }).exec()
        .then(() => {
          Tweet.updateOne(
            { _id: req.params.tweetId },
            {
              $push: {
                'replies': [saved._id]
              }
            }).exec()
            .then(saved => res.status(200).json(saved))
            .catch(err => res.status(500).json({ error: err }));
        })
        .catch(err => res.status(500).json({ error: err }));
    })
    .catch(err => res.status(500).json({ error: err }));
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
