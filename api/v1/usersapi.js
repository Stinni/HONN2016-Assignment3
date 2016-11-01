// HONN2016 - Assignment 3
// Students: Kristinn Heiðar Freysteinsson & Snorri Hjörvar Jóhannsson
// Email: kristinnf13@ru.is; snorri13@ru.is

const express = require("express");
const ObjectId = require('mongoose').Types.ObjectId;
const entities = require("./../entities/entities");
const auth = require("./../utils/auth");
const bodyParser = require("body-parser");
const uuid = require("node-uuid");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/*
GET /api/v1/users
Returns the profile info for an authenticated user.
*/
app.get("/", (req, res) => {
	if(!req.headers.hasOwnProperty("authorization")) {
		return res.status(401).send("Authorization header missing!");
	}

	auth(req.headers.authorization, (userid) => {
		if(!userid) {
			return res.status(401).send("Not authorized!");
		}

		entities.Users.findOne({"userid": userid}, (err, doc) => {
			if(err) {
				return res.status(500).send("Something went wrong with fetching from the database");
			}

			return res.status(200).json({userid: doc.userid, username: doc.username,
								favoriteVideos: doc.favoriteVideos, closeFriends: doc.closeFriends});
		});
	});
});

/*
PUT /api/v1/users
Updates the username and email of an authenticated user.
*/
app.put("/", (req, res) => {
	if(!req.headers.hasOwnProperty("authorization")) {
		return res.status(401).send("Authorization header missing!");
	}

	if(!req.body.hasOwnProperty("username")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'username' field!");
	}
	var username = req.body.username;

	if(!req.body.hasOwnProperty("email")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'email' field!");
	}
	var email = req.body.email;

	auth(req.headers.authorization, (userid) => {
		if(!userid) {
			return res.status(401).send("Not authorized!");
		}

		entities.Users.findOne({"userid": userid}, (err, doc) => {
			if(err) {
				return res.status(500).send("Something went wrong with fetching from the database");
			}

			doc.set("username", username);
			doc.set("email", email);
			doc.save((serr) => {
				if(serr) {
					return res.status(500).send("Something went wrong when saving to the database.");
				}
				return res.status(200).send("Username has been updated.");
			});
		});
	});
});

/*
POST /api/v1/users/friends
Allows an authenticated user to add a friend to his close friends list. The user must provide the userid.
*/
app.post("/friends", (req, res) => {
	if(!req.headers.hasOwnProperty("authorization")) {
		return res.status(401).send("Authorization header missing!");
	}

	if(!req.body.hasOwnProperty("userid")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'userid' field!");
	}
	var friend_id = req.body.userid;

	auth(req.headers.authorization, (userid) => {
		if(!userid) {
			return res.status(401).send("Not authorized!");
		}

		entities.Users.findOne({"userid": friend_id}, (err, doc) => {
			if(err) {
				return res.status(500).send("Something went wrong with fetching from the database");
			}
			if(doc === null) {
				return res.status(404).send("No user found with id: " + friend_id);
			}

			entities.Users.findOne({"userid": userid}, (ferr, fdoc) => {
				if(ferr) {
					return res.status(500).send("Something went wrong with fetching from the database");
				}
				fdoc.closeFriends.push(friend_id);
				fdoc.save((serr) => {
					if(serr) {
						return res.status(500).send("Something went wrong when saving to the database.");
					}
					return res.status(200).send("A friend has been added to your close friend's list.");
				});
			});
		});
	});
});

/*
POST /api/v1/users/videos
Allows an authenticated user to add a friend to his close friends list. The user must provide the userid.
*/
app.post("/videos", (req, res) => {
	if(!req.headers.hasOwnProperty("authorization")) {
		return res.status(401).send("Authorization header missing!");
	}

	if(!req.body.hasOwnProperty("videoid")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'videoid' field!");
	}
	var videoid = req.body.videoid;

	auth(req.headers.authorization, (userid) => {
		if(!userid) {
			return res.status(401).send("Not authorized!");
		}

		entities.Videos.findOne({"_id": new ObjectId(videoid)}, (err, doc) => {
			if(err) {
				return res.status(500).send("Something went wrong with fetching from the database");
			}
			if(doc === null) {
				return res.status(404).send("No video found with id: " + videoid);
			}

			entities.Users.findOne({"userid": userid}, (ferr, fdoc) => {
				if(ferr) {
					return res.status(500).send("Something went wrong with fetching from the database");
				}
				fdoc.favoriteVideos.push(videoid);
				fdoc.save((serr) => {
					if(serr) {
						return res.status(500).send("Something went wrong when saving to the database.");
					}
					return res.status(200).send("A video has been added to your favorite videos.");
				});
			});
		});
	});
});

module.exports = app;
