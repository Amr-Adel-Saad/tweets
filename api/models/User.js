const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		match: /^[a-z0-9_\-]+$/
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	},
	password: {
		type: String,
		required: true
	},
	image: {
		type: String,
		default: '/uploads/default.png'
	},
	tweets: {
		type: Array,
		default: []
	},
	following: {
		type: Array,
		default: []
	},
	followers: {
		type: Array,
		default: []
	}
});

module.exports = mongoose.model('User', UserSchema);