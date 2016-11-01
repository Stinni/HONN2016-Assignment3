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
POST /api/v1/accounts
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
				return res.json(accerr);
				//console.log(accerr); // Here a logger should be added
				/*return res.status(412).send("ValidationError occurred. Name has to be included and be at least 4 " +
				"characters and the password has to be at least 8 and no more than 32 characters.");*/
			}
			return res.json(accerr);
			//console.log(accerr); // Here a logger should be added
			//return res.status(500).send("Something went wrong with adding the account to the database");
		}

		entities.Authentications.create({"userid": accdoc._id, "token": uuid.v1()}, (autherr, authdoc) => {
			if(autherr) {
				console.log(autherr); // Here a logger should be added
				return res.status(500).send("The account was created but something went wrong with logging in user " +
					"with id: " + accdoc._id);
			}
			return res.status(201).json({userid: accdoc._id, token: authdoc.token});
		});
	});
});

/*
PUT /api/v1/accounts/:id
Updates the account password. The client has to be logged in/authenticated. And both the old and new passwords have to
be included. The old one has to mach the current one.
*/
app.put("/:id", (req, res) => {
	if(!req.headers.hasOwnProperty("authorization")) {
		return res.status(401).send("Authorization header missing!");
	}
	var id = req.params.id;

	if(!req.body.hasOwnProperty("oldpassword")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'oldpassword' field!");
	}
	var oldpassword = req.body.oldpassword;

	if(!req.body.hasOwnProperty("newpassword")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'newpassword' field!");
	}
	var newpassword = req.body.newpassword;

	entities.Accounts.findOne({"_id": new ObjectId(id)}, (err, doc) => {
		if(err) {
			return res.status(500).send("An error occurred while fetching an account from the database.");
		}
		if(doc === null) {
			return res.status(404).send("No account found with id: " + id);
		}

		auth(req.headers.authorization, (userid) => {
			if(!userid) {
				return res.status(401).send("Not authorized!");
			}
			if(oldpassword !== doc.password) {
				return res.status(401).send("Incorrect password!");
			}
			doc.set("password", newpassword);
			doc.save().then((sdoc) => {
				return res.status(200).send("Password has been updated.");
			});
		});
	});
});

/*
POST /api/v1/accounts/login
Allows for account login. The client must provide the name and password. The
response contains the authorization token of the newly created user. A token can also be got with logging in.
*/
app.post("/login", (req, res) => {
	if(!req.body.hasOwnProperty("name")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'name' field!");
	}
	var name = req.body.name;

	if(!req.body.hasOwnProperty("password")) {
		return res.status(412).send("Post syntax is incorrect. Message body has to include a 'password' field!");
	}
	var password = req.body.password;

	entities.Accounts.findOne({"name": name}, (accerr, accdoc) => {
		if(accerr) {
			return res.status(500).send("An error occurred while fetching from the database.");
		}
		if(accdoc === null) {
			return res.status(404).send("No account found with name: " + name);
		}
		if(password !== accdoc.password) {
			return res.status(401).send("Incorrect password!");
		}

		entities.Authentications.findOne({"userid": accdoc._id}, (autherr, authdoc) => {
			if(autherr) {
				return res.status(500).send("An error occurred while fetching from the database.");
			}
			if(authdoc === null) {
				entities.Authentications.create({"userid": accdoc._id, "token": uuid.v1()}, (cerr, cdoc) => {
					if(cerr) {
						console.log(cerr); // Here a logger should be added
						return res.status(500).send("Something went wrong with logging in user with id: " + accdoc._id);
					}
					return res.status(200).json({userid: accdoc._id, token: cdoc.token});
				});
			} else {
				authdoc.set("createdAt", Date.now());
				authdoc.save().then((sdoc) => {
					return res.status(200).json({userid: sdoc.userid, token: sdoc.token});
				});
			}
		});
	});
});

app.delete("/:id", (req, res) => {
	if(!req.headers.hasOwnProperty("authorization")) {
		return res.status(401).send("Authorization header missing!");
	}
	var id = req.params.id;

	auth(req.headers.authorization, (userid) => {
		if(!userid) {
			return res.status(401).send("Not authorized!");
		}
		if(id !== userid) {
			return res.status(401).send("You're not authorized to delete this account!");
		}

		var promise = entities.Authentications.remove({"userid": id}, (err) => {
			if(err) {
				console.log(err); // Here a logger should be added
				return res.status(500).send("Something went wrong with removing a authentication record from the database.");
			} else {
				console.log("Authentication record removed from the database.");
			}
		});

		promise.then(() => {
			entities.Accounts.remove({"_id": new ObjectId(id)}, (err) => {
				if(err) {
					console.log(err); // Here a logger should be added
					return res.status(500).send("Something went wrong with removing an account from the database.");
				} else {
					console.log("Account removed from the database.");
					return res.status(200).send("Your account has been removed from the database.");
				}
			});
		});
	});
});

module.exports = app;
