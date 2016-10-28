const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	punchCount: {
		type: Number,
		min: 2,
		default: 10
	}
},{
	versionKey: false
});

const VideoEntity = mongoose.model("Video", VideoSchema);

module.exports = VideoEntity;
