var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
const yelp = require('yelp-fusion');

const clientId=process.env.YELP_CONSUMER_KEY;
const clientSecret=process.env.YELP_CONSUMER_SECRET;

const searchRequest = {
  term:'Four Barrel Coffee',
  location: 'san francisco, ca'
};

yelp.accessToken(clientId, clientSecret).then(response => {
  const client = yelp.client(response.jsonBody.access_token);

  client.search(searchRequest).then(response => {
    const firstResult = response.jsonBody.businesses[0];
    var prettyJson = JSON.stringify(firstResult, null, 4);
    prettyJson = JSON.parse(prettyJson);
  //  console.log(prettyJson)
    var rest = new models.Restaurant({
      restname: prettyJson.name,
      restlocation: {
        display_address: prettyJson.location.display_address,
        zip_code: prettyJson.location.zip_code,
        city: prettyJson.location.city,
        address1: prettyJson.location.address1,
        state: prettyJson.location.state,
        country: prettyJson.location.country
      },
      restdistance: prettyJson.distance,
      restcategory: prettyJson.categories,
      restcoord: {
        restlat: prettyJson.coordinates.latitude,
        restlng: prettyJson.coordinates.longitude
      },
      restrating: prettyJson.rating,
      restphone: prettyJson.phone,
      restprice: prettyJson.price,
      restdisplayphone: prettyJson.display_phone,
      restcount: prettyJson.review_count,
      resturl: prettyJson.url
    });
    console.log(rest);
    rest.save(function(err){
      if(err) console.log(err);
    });

    console.log(prettyJson);
    console.log('hello')
  });
}).catch(e => {
  console.log(e);
});
//////////////////////////////// PUBLIC ROUTES ////////////////////////////////
// Users who are not logged in can see these routes
router.get('/signup', function(req,res){
res.render('signup');
});

router.post('/signup', function(res,res){

});

router.get('/', function(req, res, next) {
  res.render('home');
});

///////////////////////////// END OF PUBLIC ROUTES /////////////////////////////

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

//////////////////////////////// PRIVATE ROUTES ////////////////////////////////
// Only logged in users can see these routes

router.get('/protected', function(req, res, next) {
  res.render('protectedRoute', {
    username: req.user.username,
  });
});

///////////////////////////// END OF PRIVATE ROUTES /////////////////////////////

module.exports = router;
