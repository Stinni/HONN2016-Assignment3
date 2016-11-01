// HONN2016 - Assignment 3
// Students: Kristinn Heiðar Freysteinsson & Snorri Hjörvar Jóhannsson
// Email: kristinnf13@ru.is; snorri13@ru.is

const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	channels: [{
		type: String
	}]
},{
	versionKey: false
});

const VideoEntity = mongoose.model("Video", VideoSchema);

module.exports = VideoEntity;
