var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  phone: String
});

var restaurantSchema = mongoose.Schema({
  restname: {
    type: String,
    required: true
  },
  restlocation: {
    display_address:Array,
    zip_code: String,
    city: String,
    address1: String,
    state: String,
    country: String
  },
  restdistance: Number,
  restcategory: [{}],
  restcoord: {
    type: Object,
    required: true
  },
  restrating: Number,
  restphone: {
    type: String,
    required: true
  },
  restprice: String,
  restdisplayphone: String,
  restcount: Number,
  resturl: {
    type: String,
    required: true
  },
  restleaf: Number
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
