// HONN2016 - Assignment 3
// Students: Kristinn Heiðar Freysteinsson & Snorri Hjörvar Jóhannsson
// Email: kristinnf13@ru.is; snorri13@ru.is

const entities = require("./../entities/entities");

var authenticate = function authenticate(token) {
	entities.Authentications.findOne({"token": token}, (err, doc) => {
		if(err) {
			console.log(err); // Here a logger should be added
			return null;
		}
		if(doc === null) {
			return null;
		}
		return doc.userid;
	});
}

module.exports = authenticate;
