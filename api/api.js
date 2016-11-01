// Assignment 8, weeks 9-10
// Student: Kristinn Heiðar Freysteinsson
// Email: kristinnf13@ru.is

const express = require("express");
const accounts = require("./v1/accountsapi");
const users = require("./v1/usersapi");
const videos = require("./v1/videosapi");

const api = express();

api.use("/api/v1/accounts", accounts);
api.use("/api/v1/users", users);
api.use("/api/v1/videos", videos);

module.exports = api;
