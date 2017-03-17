var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var BlogScheMa = new Schema({
    key:String,
    title:String,
    content:String,
    catkey:String,
    catname:String,
    create_time:Number,
    hits:Number,
    markdown:String
});
exports.blogs = mongoose.model('blogs',BlogScheMa);
