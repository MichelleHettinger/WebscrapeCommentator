
// require mongoose
var mongoose = require('mongoose');

// create the Schema class
var Schema = mongoose.Schema;

// new Schema: UserSchema
var CommentSchema = new Schema({
  // Reference to article
  articleRef: {
    type: String,
    required: true
  },
  // Actual comment
  articleComment: {
    type: String,
  },
  // lastUpdated: a date type entry
  lastUpdated: {type: Date}
});
 

/* vvv CUSTOM METHODS HERE vvv */



//   UserSchema.methods.getFullName = function(){
//     this.fullName = this.firstName + " " + this.lastName;
//   }

// // lastUpdatedDate: save the current date to a variable
// // and return it

//   UserSchema.methods.lastUpdatedDate = function(){
//     this.lastUpdated = Date.now();
//   }


// use the above schema to make the User model
var User = mongoose.model('Comment', CommentSchema);


// export the model so the server can use it
module.exports = User;
