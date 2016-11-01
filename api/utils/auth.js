// HONN2016 - Assignment 3
// Students: Kristinn Heiðar Freysteinsson & Snorri Hjörvar Jóhannsson
// Email: kristinnf13@ru.is; snorri13@ru.is

const entities = require("./../entities/entities");

module.exports = function authenticate(token, cb) {
	entities.Authentications.findOne({"token": token}, (err, doc) => {
		if(err) {
			console.log(err); // Here a logger should be added
			cb(null);
		}
		else if(doc === null) {
			console.log("doc returned is null");
			cb(null);
		}
		else {
			cb(doc.userid);
		}
	});
}
