const express = require('express');
const chalk = require('chalk')
const nunjucks = require('nunjucks')
const app = express();


//start basic HTTP server and listens on port 3000 for connections
app.listen(3000, function(){
    console.log('server listening')
})

//middleware logging each request to server
app.use('/', function(req, res, next){
    console.log(chalk.magenta(req.method, req.path));
    res.on('finish', () => logStatus(res));
    next();
})

function logStatus(res) {
    console.log(chalk.magenta(res.statusCode));
}

app.use('/special', function(req, res, next){
    res.send('special!')
    next();
})


app.get('/', function(req, res, next){
    const people = [{name: 'Grace'}, {name: 'Hopper'}, {name: 'Daughter'}];
    nunjucks.render('index.html', people, function (err, output) {});
    res.render( 'index', {title: 'All About Me', people: people} );
})


//NUNJUCKS HTML RENDERER
nunjucks.configure("views", { noCache: true })
app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', nunjucks.render)
