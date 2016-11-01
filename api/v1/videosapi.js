// HONN2016 - Assignment 3
// Students: Kristinn Heiðar Freysteinsson & Snorri Hjörvar Jóhannsson
// Email: kristinnf13@ru.is; snorri13@ru.is

const express = require("express");
const ObjectId = require('mongoose').Types.ObjectId;
const entities = require("./../entities/entities");
const auth = require("./../utils/auth");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
GET /api/v1/videos
Fetches a list of all the videos that have been added to the database.
*/
app.get("/", (req, res) => {
	if(!req.headers.hasOwnProperty("authorization")) {
		return res.status(401).send("Authorization header missing!");
	}

	auth(req.headers.authorization, (userid) => {
		if(!userid) {
			return res.status(401).send("Not authorized!");
		}

		entities.Videos.find((err, docs) => {
			if(err) {
				console.log(err); // Here a logger should be added
				return res.status(500).send("An error occurred while fetching videos from the database.");
			}
			res.json(docs);
		});
	});
});

/*
GET /api/v1/videos/:cId
Fetches a list of all the videos in a certain channel.
*/
app.get("/:cId", (req, res) => {
	if(!req.headers.hasOwnProperty("authorization")) {
		return res.status(401).send("Authorization header missing!");
	}

	var cId = req.params.cId;

	auth(req.headers.authorization, (userid) => {
		if(!userid) {
			return res.status(401).send("Not authorized!");
		}

		entities.Videos.find({"channels": cId}, (err, docs) => {
			if(err) {
				console.log(err); // Here a logger should be added
				return res.status(500).send("An error occurred while fetching videos from the database.");
			}
			res.json(docs);
		});
	});
});

/*
POST /api/v1/videos
Adds a video to the database. The client must provide the name and description.
Other attributes must be updated/added afterwards.
*/
app.post("/", (req, res) => {
	if(!req.headers.hasOwnProperty("authorization")) {
		return res.status(401).send("Authorization header missing!");
	}

	if(!req.body.hasOwnProperty("name")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'name' field!");
	}
	var name = req.body.name;

	if(!req.body.hasOwnProperty("description")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'description' field!");
	}
	var description = req.body.description;

	auth(req.headers.authorization, (userid) => {
		if(!userid) {
			return res.status(401).send("Not authorized!");
		}

		entities.Videos.create({"name": name, "description": description}, (verr, vdoc) => {
			if(verr) {
				console.log(verr); // Here a logger should be added
				return res.status(500).send("Something went wrong with adding the video to the database");
			}
			return res.status(201).json(vdoc);
		});
	});
});

module.exports = app;
