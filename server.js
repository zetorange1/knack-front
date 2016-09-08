// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var port  	 = process.env.PORT || 8000; 				// set the port

var morgan = require('morgan'); 		// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
// var basicAuth = require('basic-auth');

// var auth = function (req, res, next) {
//   function unauthorized(res) {
//     res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//     return res.send(401);
//   };

//   var user = basicAuth(req);

//   if (!user || !user.name || !user.pass) {
//     return unauthorized(res);
//   };

//   if (user.name === 'knacker' && user.pass === 'uKnack2016!') {
//     return next();
//   } else {
//     return unauthorized(res);
//   };
// };

// app.get('/', auth, function (req, res) {
//   res.sendfile('index.html', { root: __dirname + '/angular' });
// });

app.use(express.static(__dirname + '/angular')); 
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.all('/*', function(req, res, next) {
  res.sendfile('index.html', { root: __dirname + '/angular' });
});


// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);

