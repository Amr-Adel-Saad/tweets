const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReplySchema = new Schema({
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
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{ timestamps: true });

module.exports = mongoose.model('Reply', ReplySchema);