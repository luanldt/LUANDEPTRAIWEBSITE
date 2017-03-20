var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    local: {
        Email: String,
        Password: String
    },
    Phone: String,
    Name: String
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.local.Password);
}

User = mongoose.model("Users", userSchema);

module.exports = User;