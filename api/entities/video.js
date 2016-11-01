// HONN2016 - Assignment 3
// Students: Kristinn Heiðar Freysteinsson & Snorri Hjörvar Jóhannsson
// Email: kristinnf13@ru.is; snorri13@ru.is

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
