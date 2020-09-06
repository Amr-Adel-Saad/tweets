const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
	content: {
		type: String,
		required: true
	},
	likers: {
		type: Array,
		default: []
  },
  likes: {
    type: Number,
    default: 0
  },
  date: {
    type: Object,
    default: new Date()
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Tweet', TweetSchema);