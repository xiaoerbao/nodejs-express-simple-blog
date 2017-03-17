var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userScheMa = new Schema({
    username:String,
    password:String
});
exports.users = mongoose.model("users",userScheMa);
