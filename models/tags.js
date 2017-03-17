var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var tagScheMa = new Schema({
    key:String,
    name:String
});
exports.tags = mongoose.model("tags",tagScheMa);
