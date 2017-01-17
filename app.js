const express = require('express');
const chalk = require('chalk')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const bodyParser = require('body-parser')
const app = express();

//start basic HTTP server and listens on port 3000 for connections
app.listen(3000, function(){
    console.log('server listening')
})


//** MIDDLEWARE **//

//for POST requests to server by client, we want to be able to parse their message body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//logging each server request to terminal
app.use('/', function(req, res, next){
    console.log(chalk.magenta(req.method, req.path));
    res.on('finish', () => logStatus(res));
    next();
})
//requires all server requests to any page to go through 'routes' (which is where we have all routing logic)
app.use('/', routes)

//allows each server request to access everything in public folder. So when HTML loads with the link that will request stylesheets/style.css, it will be routed by this middleware to that file, without us having to write a GET for that specific file.
app.use(express.static('public'))


//** LOGGING STATUS OF REQUESTS IN OUR TERMINAL **//
function logStatus(res) {
    console.log(chalk.magenta(res.statusCode));
}


//NUNJUCKS HTML RENDERER
nunjucks.configure("views", { noCache: true })
app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', nunjucks.render)
