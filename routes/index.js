const {db, User, Tweet} = require('../models');

const express = require('express');
const router = express.Router(); //special entity to function as router
// could use one line instead: const router = require('express').Router();



// **below is route to send back our css file. not using it because we're using express.static instead, which will insure that everything in our public folder will be accessible for each server call.
// router.get('/stylesheets/style.css', function(req,res,next){
// 	res.sendFile('style.css', { root: path.join(__dirname, '../public/stylesheets') })
// })


module.exports = function (io) {
	//how to respond to client requests to root path
	router.get('/', function (req, res, next) {
		//let tweets = tweetBank.list();

		Tweet.findAll({
			include: [User]
		})
			.then((allTweets) => {
				res.render('index', {tweets: allTweets, showForm: true, homePage: true})
			})
			.catch(next)

	});

	//how to respond to requests to /users/:name
	router.get('/users/:name', function (req, res, next) {
		var name = req.params.name; //even though its Karen%20Dunderproto, still can find Karen Dunderproto below
		//var list = tweetBank.find(function(tweeter){
		//	return tweeter.name.toLowerCase() === name.toLowerCase();
		//});

		User.findOne({
			where: {
				name: name
			}
		})
			.then((user) => {
				return Tweet.findAll({
					where: {
						userId: user.id
					},
					include: [User]
				})
			})
			.then((userTweets) => {
				res.render( 'index', { tweets: userTweets, showForm: true, showUser: true } )
			})
			.catch(next)
	});

	router.get('/tweets/:id', function (req, res, next) {
		var id = req.params.id; //even though its Karen%20Dunderproto, still can find Karen Dunderproto below
		// var list = tweetBank.find(function(tweeter){
		// 	return tweeter.id === Number(id);
		// });

		Tweet.findAll({
			where: {
				id: id
			},
			include: [User]
		})
			.then((tweet) => {
				res.render( 'index', { tweets: tweet } )
			})
		.catch(next)
	});

	//if client fills out form and submits, browser will send POST request to our server to the URI => /tweets. Thus, we need to define a POST that will listen for requests going to /tweets
	router.post('/tweets', function(req, res, next) {
		var name = req.body.name;
		var text = req.body.text;	//contents of message body

		var creatingUser = User.findOrCreate({
			where: {	name: name	}})
		var creatingTweet = Tweet.create({content: text})

		Promise.all([creatingUser, creatingTweet])
			.then(([[user, createdBool], tweet]) => {
				return tweet.setUser(user);
			})
			.then((newTweet) => {
				io.sockets.emit('newTweet', { newTweet });
				res.redirect('/users/' + name);
			})
			.catch(next)

	});
  return router;
};
