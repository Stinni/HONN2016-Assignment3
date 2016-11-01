// HONN2016 - Assignment 3
// Students: Kristinn Heiðar Freysteinsson & Snorri Hjörvar Jóhannsson
// Email: kristinnf13@ru.is; snorri13@ru.is

const mongoose = require("mongoose");

const AuthenticationSchema = new mongoose.Schema({
	userid: {
		type: String,
		required: true,
		unique: true
	},
	token: {
		type: String,
		required: true,
		unique: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
},{
	versionKey: false
});

AuthenticationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 216000 });

const AuthenticationEntity = mongoose.model("Authentication", AuthenticationSchema);

module.exports = AuthenticationEntity;
