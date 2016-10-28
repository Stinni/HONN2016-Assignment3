const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		validate: function(n) {
			return n !== null && n.length;
		}
	},
	token: {
		type: String,
		required: true,
		unique: true
	},
	gender: {
		type: String,
		match: /^(m|f|o)$/
	}
},{
	versionKey: false
});

const UserEntity = mongoose.model("User", UserSchema);

module.exports = {
	Users: UserEntity
};
