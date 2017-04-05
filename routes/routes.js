var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var data =  require('../data')
const yelp = require('yelp-fusion');


const clientId=process.env.YELP_CONSUMER_KEY;
const clientSecret=process.env.YELP_CONSUMER_SECRET;


var searchArray=[]
for(var key in data){
  searchArray.push(key);
  console.log(key);
}

searchArray.forEach(function(element){
  var searchRequest = {
    term:element,
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

      // rest.save(function(err){
      //   if(err) console.log(err);
      // });
      models.Restaurant.findOrCreate(rest, function(err){
        if(err) console.log(err);
      });
    });
  }).catch(e => {
    console.log(e);
  });
});
//////////////////////////////// PUBLIC ROUTES ////////////////////////////////
// Users who are not logged in can see these routes
router.get('/privacy', function(req, res) {
  res.render('privacy');
});

router.get('/facebook', function(req, res) {
  res.redirect('https://www.facebook.com/')
});

router.get('/signup', function(req,res){
  res.render('signup');
});

router.post('/signup', function(res,res){

});

router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/businesslogin', function(req, res, next) {
  res.render('login')
});

// router.post('/search', function(req, res, next) {
//   console.log(req.body);
// })

router.get('/search', function(req, res, next) {
  res.render('home')
})

router.post('/search', function(req, res) {
  var q= {
    vegan: {$gte:0},
    vegetarian: {$gte:0},
    nut: {$gte:0},
    milk: {$gte:0},
    gluten: {$gte:0},
    restdistance: {$gte:0},
    dollar:  {$gte:0},
    leaf: {$gte:0}
  }
//food restriction
if(req.body.Vegan) q.vegan = {$gt:0};
if(req.body.Vegetarian) q.vegetarian = {$gt:0};
if(req.body.NutFree) q.nut = {$gt:0};
if(req.body.LactoseFree) q.milk = {$gt:0};
if(req.body.GlutenFree) q.gluten = {$gt:0};
//distance
if(req.body.lessthanone) q.distance = {$lt:1};
if(req.body.onetofive) q.distance = {$gt:1, $lt:5};
if(req.body.sixtofifteen) q.distance = {$gt:6,$lt:15};
if(req.body.sixteenplus) q.distance = {$gt:16};
//dollar
if(req.body.onedollar) q.dollar = {$lte:'$'};
if(req.body.twodollar) q.dollar = {$lte:'$$'};
if(req.body.threedollar) q.dollar = {$lte:'$$$'};
if(req.body.fourdollar) q.dollar = {$lte:'$$$$'};
//leafs
if(req.body.SingleLeaf) {
  if(req.body.Vegan) q.vegan = 1;
  if(req.body.Vegetarian) q.vegetarian = 1;
  if(req.body.NutFree) q.nut = 1;
  if(req.body.LactoseFree) q.milk = 1;
  if(req.body.GlutenFree) q.gluten = 1;
}
console.log('lisa');
console.log(q);
console.log('===');
console.log('restleaf.vegan');
models.Restaurant.find({"restleaf.vegan": q.vegan, "restleaf.vegetarian": q.vegetarian,
 "restleaf.milk": q.milk, "restleaf.nut": q.nut, "restleaf.glutenfree": q.gluten,
  "restprice": q.dollar}, function (err, restaurants) {
  if (err) { console.log(err); }
  else {
    console.log(restaurants);

    res.render('list', {restaurants: restaurants});
  }
});

});

///////////////////////////// END OF PUBLIC ROUTES /////////////////////////////

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next('login');
  }
});

//////////////////////////////// PRIVATE ROUTES ////////////////////////////////
// Only logged in users can see these routes

router.get('/protected', function(req, res, next) {
  res.render('protectedRoute', {
    username: req.user.username
  });
});

///////////////////////////// END OF PRIVATE ROUTES /////////////////////////////

module.exports = router;
