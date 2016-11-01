// HONN2016 - Assignment 3
// Students: Kristinn Heiðar Freysteinsson & Snorri Hjörvar Jóhannsson
// Email: kristinnf13@ru.is; snorri13@ru.is

const AccountEntity = require("./account");
const AuthenticationEntity = require("./authentication");
const UserEntity = require("./user");
const VideoEntity = require("./video");

module.exports = {
	Accounts: AccountEntity,
	Authentications: AuthenticationEntity,
	Users: UserEntity,
	Videos: VideoEntity
};
