var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  textBody: {
    type:String
  }
});

var Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
