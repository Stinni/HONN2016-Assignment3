// HONN2016 - Assignment 3
// Students: Kristinn Heiðar Freysteinsson & Snorri Hjörvar Jóhannsson
// Email: kristinnf13@ru.is; snorri13@ru.is

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	userid: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
		validate: function(n) {
			return n !== null && n.length;
		}
	},
	favoriteVideos: [{
		type: String
	}],
	closeFriends: [{
		type: String
	}]
},{
	versionKey: false
});

const UserEntity = mongoose.model("User", UserSchema);

module.exports = UserEntity;
