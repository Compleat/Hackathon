var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  phone: String
});

var restaurantSchema = mongoose.Schema({
  restname: String,
  restlocation: String,
  restphone: String

});

// TODO - this lol
var filterSchema = mongoose.Schema({
  filter: String
});

User = mongoose.model('User', userSchema);
Restaurant = mongoose.model("Restaurant", restaurantSchema);
Filter = mongoose.model("Filter", filterSchema);

module.exports = {
    User:User,
    Restaurant:Restaurant,
    Filter:Filter
};
