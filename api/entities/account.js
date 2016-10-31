const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		validate: function(n) {
			return n !== null && n.length;
		}
	},
	password: {
		type: String,
        required: true
	},
	token: {
		type: String,
		required: true,
		unique: true
	}
},{
	versionKey: false
});

const AccountEntity = mongoose.model("Account", AccountSchema);

module.exports = AccountEntity;
