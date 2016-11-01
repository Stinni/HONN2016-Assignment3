// HONN2016 - Assignment 3
// Students: Kristinn Heiðar Freysteinsson & Snorri Hjörvar Jóhannsson
// Email: kristinnf13@ru.is; snorri13@ru.is

const express = require("express");
const entities = require("./../entities/entities");
const bodyParser = require("body-parser");
const uuid = require("node-uuid");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
GET /api/v1/accounts
Returns a list of all accounts that are in the MongoDB. This endpoint is not authenticated.
This is not a part of the assignment and is only meant for 'testing' purposes
*/
app.get("/", (req, res) => {
	entities.Accounts.find((err, docs) => {
		if(err) {
			console.log(err); // Here a logger should be added
			return res.status(500).send("An error occurred while fetching accounts from the database.");
		}

		var tmp = [];
		docs.forEach((p) => {
			tmp.push({
				_id: p._id,
				name: p.name
			});
		});
		res.json(tmp);
	});
});

/*
POST /api/v1/accounts - 15%
Allows signup and adds a new account to the database. The client must provide the name and password. The
response contains the authorization token of the newly created user. A token can also be got with logging in.
*/
app.post("/", (req, res) => {
	if(!req.body.hasOwnProperty("name")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'name' field!");
	}
	var name = req.body.name;

	if(!req.body.hasOwnProperty("password")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'password' field!");
	}
	var password = req.body.password;

	entities.Accounts.create({"name": name, "password": password}, (accerr, accdoc) => {
		if(accerr) {
			if(accerr.name === "ValidationError") {
				return res.status(412).send("ValidationError occurred. Name has to be included and at least 4 " +
				"characters and the password has to be at least 8 and no more than 32 characters.");
			}
			console.log(accerr); // Here a logger should be added
			return res.status(500).send("Something went wrong with adding the account to the database");
		}

		entities.Authorizations.create({}, () => {
			res.status(201).json({user_id: doc._id, token: doc.token});
		});
	});
});

module.exports = app;
