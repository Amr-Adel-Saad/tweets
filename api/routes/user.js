require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, new Date() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
}

const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024 * 10
	},
	fileFilter
});

const checkAuth = require('../middleware/check-auth');
const User = require('../models/User');
const Tweet = require('../models/Tweet');

// User signup
router.post("/signup", (req, res) => {
	const { name, email, password, password2 } = req.body;
	let errors = [];

	if (!name || !email || !password || !password2) {
		errors.push('Enter required fields');
	}

	// Regex to validate email
	if (email && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) === false) {
		errors.push('Enter a valid email');
	}

	//Regex to validate username
	if (name && /^[a-z0-9_\-]+$/.test(name) === false) {
		errors.push('Username can only include small letters, dashes, and underscores');
	}

	if (password !== password2) {
		errors.push('Passwords must match');
	}

	if (password && password.length < 6) {
		errors.push('Password must be at least 6 characters');
	}

	if (errors.length > 0) {
		return res.status(400).json({ message: errors });
	} else {
		User.findOne({$or: [ {email}, {name} ]}).exec()
			.then(user => {
				if (user) {
					return res.status(409).json({ message: 'Email or username already taken' });
				} else {
					bcrypt.hash(password, 10, (err, hash) => {
						if (err) {
							return res.status(500).json({ error: err });
						}
						const newUser = new User({
							name,
							email,
							password: hash
						});
						newUser.save()
							.then(() => res.status(200).json({ message: 'User created' }))
							.catch(err => res.status(500).json({ error: err }));
					});
				}
			})
			.catch(err => res.status(500).json({ error: err }));
	}
});

// User login
router.post('/login', (req, res) => {
	User.findOne({ name: req.body.name }).exec()
		.then(user => {
			if (user) {
				bcrypt.compare(req.body.password, user.password, (err, result) => {
					if (err) {
						return res.status(401).json({ message: 'Auth failed' });
					}
					if (result) {
						const token = jwt.sign({ name : user.name, userId: user._id }
							, process.env.JWT_KEY,
							{ expiresIn: '24h' });

						return res.status(200).json({ message: 'Auth successful', token, user });
					}
					return res.status(401).json({ message: 'Auth failed' });
				});
			} else {
				return res.status(401).json({ message: 'Auth failed' });
			}
		})
		.catch(err => res.status(500).json({ error: err }));
});

// User profile
router.get('/:userId', checkAuth, (req,res) => {
	if (req.params.userId === req.userData.userId) {
		User.findOne({ _id: req.userData.userId }).select('-password').populate('tweets').exec()
			.then(user => res.status(200).json(user))
			.catch(err => res.status(500).json({ error: err }));
	} else {
		res.status(401).json({ message: 'Auth failed' });
	}
});

// User update
router.patch('/:userId', upload.single('userImage'), checkAuth, (req, res) => {
	if (req.params.userId === req.userData.userId) {
		if (req.file !== undefined) {
			User.updateOne(
				{ _id: req.params.userId }, 
				{ $push: req.body, image: `/${req.file.path}` }).exec()
				.then(() => res.status(200).json({ message: 'User updated' }))
				.catch(err => res.status(500).json({ error: err }));
		} else {
			User.updateOne(
				{ _id: req.params.userId }, 
				{ $addToSet: req.body }).exec()
				.then(() => res.status(200).json({ message: 'User updated' }))
				.catch(err => res.status(500).json({ error: err }));
		}
	} else {
		res.status(401).json({ message: 'Auth failed' });
	}
});

// User delete
router.delete('/:userId', checkAuth, (req, res) => {
	if (req.params.userId === req.userData.userId) {
		User.deleteOne({ _id: req.params.userId }).exec()
			.then(() => res.status(200).json({ message: 'User deleted' }))
			.catch(err => res.status(500).json({ error: err }));
	} else {
		res.status(401).json({ message: 'Auth failed' });
	}
});

// Current profile
router.get('/profile/:username', (req, res) => {
	User.findOne({ name: req.params.username }).select('-password').populate('tweets').exec()
		.then(profile => {
			if (profile) {
				return res.status(200).json(profile);
			} else {
				return res.status(404).json({ message: 'Profile not found' });
			}
		})
		.catch(err => res.status(500).json({ error: err }));
});

// Current profile update
router.patch('/profile/:username', checkAuth, (req, res) => {
	if (req.body.type === 'follow') {
		User.updateOne(
			{ name: req.params.username }, 
			{ $addToSet: { followers: req.userData.name } }).exec()
			.then(() => User.updateOne(
				{ _id: req.userData.userId }, 
				{ $addToSet: { following: req.params.username } }).exec()
				.then(() => res.status(200).json({ message: 'Added follow' }))
				.catch(err => res.status(500).json({ error: err })))
			.catch(err => res.status(500).json({ error: err }));
	} else if (req.body.type === 'unfollow') {
		User.updateOne(
			{ name: req.params.username }, 
			{ $pull: { followers: req.userData.name } }).exec()
			.then(() => User.updateOne(
				{ _id: req.userData.userId }, 
				{ $pull: { following: req.params.username } }).exec()
				.then(() => res.status(200).json({ message: 'Removed follow' }))
				.catch(err => res.status(500).json({ error: err })))
			.catch(err => res.status(500).json({ error: err }));
	}
});

module.exports = router;