// Assignment 8, weeks 9-10
// Student: Kristinn Heiðar Freysteinsson
// Email: kristinnf13@ru.is

const express = require("express");
const users = require("./v1/usersapi");
const companies = require("./v1/companiesapi");

const api = express();

api.use("/api/v1/users", users);
api.use("/api/v1/companies", companies);

module.exports = api;
