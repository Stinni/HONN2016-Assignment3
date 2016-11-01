// HONN2016 - Assignment 3
// Students: Kristinn Heiðar Freysteinsson & Snorri Hjörvar Jóhannsson
// Email: kristinnf13@ru.is; snorri13@ru.is

const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		minlength: 4
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		maxlength: 32
	}
},{
	versionKey: false
});

const AccountEntity = mongoose.model("Account", AccountSchema);

module.exports = AccountEntity;
