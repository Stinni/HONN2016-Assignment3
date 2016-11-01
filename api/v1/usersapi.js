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
POST /api/v1/users
Allows administrators to add a new user. The client must provide the name and gender properties. Otherwise
similar to the method which adds a company, except that the response contains the token of the newly created user.
*/
app.post("/", (req, res) => {
	if(!req.headers.hasOwnProperty("authorization") || req.headers.authorization !== adminToken) {
		return res.status(401).send("Not authorized");
	}

	if(!req.body.hasOwnProperty("name")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'name' field!");
	}
	var name = req.body.name;

	if(!req.body.hasOwnProperty("gender")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'gender' field!");
	}
	var gender = req.body.gender;

	entities.Users.create({"name": name, "token": uuid.v1(), "gender": gender}, (err, doc) => {
		if(err) {
			if(err.name === "ValidationError") {
				return res.status(412).send("ValidationError occurred. Either name wasn't included or the gender isn't formatted right");
			}
			console.log(err); // Here a logger should be added
			return res.status(500).send("Something went wrong with adding the user to the database");
		}
		res.status(201).json({user_id: doc._id, token: doc.token});
	});
});

module.exports = app;
