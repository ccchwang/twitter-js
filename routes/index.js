const express = require('express');
const path = require('path');
const router = express.Router(); //special entity to function as router
// could use one line instead: const router = require('express').Router();
const tweetBank = require('../tweetBank');

//how to respond to client requests to root path
router.get('/', function (req, res) {
  let tweets = tweetBank.list();
  res.render( 'index', { tweets: tweets, showForm:true, homePage: true} );
});

//how to respond to requests to /users/:name
router.get('/users/:name', function (req, res) {
  var name = req.params.name; //even though its Karen%20Dunderproto, still can find Karen Dunderproto below
	var list = tweetBank.find(function(tweeter){
		return tweeter.name.toLowerCase() === name.toLowerCase();
	});
	res.render( 'index', { tweets: list, showForm: true, showUser: true } )
});

router.get('/tweets/:id', function (req, res) {
  var id = req.params.id; //even though its Karen%20Dunderproto, still can find Karen Dunderproto below
	var list = tweetBank.find(function(tweeter){
		return tweeter.id === Number(id);
	});
	res.render( 'index', { tweets: list } )
});

//if client fills out form and submits, browser will send POST request to our server to the URI => /tweets. Thus, we need to define a POST that will listen for requests going to /tweets
router.post('/tweets', function(req, res) {
  var name = req.body.name;
  var text = req.body.text;	//contents of message body
  tweetBank.add(name, text);
	res.redirect('/users/' + name);
});

// **below is route to send back our css file. not using it because we're using express.static instead, which will insure that everything in our public folder will be accessible for each server call.
// router.get('/stylesheets/style.css', function(req,res,next){
// 	res.sendFile('style.css', { root: path.join(__dirname, '../public/stylesheets') })
// })


module.exports = router;
