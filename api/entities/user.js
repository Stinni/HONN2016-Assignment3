const mongoose = require("mongoose");
var bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
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
	/*token: {
		type: String,
		required: true,
		unique: true
	}, */
},{
	versionKey: false
});

UserSchema.pre('save', function (next) {
    var user = this;
    if ( this.isModified('password') || this.isNew ) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

const UserEntity = mongoose.model("User", UserSchema);

module.exports = UserEntity;