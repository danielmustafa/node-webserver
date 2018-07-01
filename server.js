const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs');
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}, ${req.method}, ${req.url}`;
    console.log(log);

    fs.appendFile('server.log',log + '\n',undefined,(err) => {
        if (err) {
            console.log(`Unable to write to server.log: ${err}`);
        }
    })

    next();
})

app.use((req,res,next) => {
    res.render('maintenance.hbs');
})

hbs.registerHelper('getCurrentYear', () => {return new Date().getFullYear()})

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {

    res.render('home.hbs', {
        pageTitle: 'Home',
        welcomeMessage: 'Welcome!'
    });

})

app.get('/about', (req, res) => {
    res.render('about.hbs',{
        pageTitle: 'About page'
    });
})

app.get('/bad', (req,res) => {
    res.statusCode = 400;
    res.send({
        "error": {
            "code": 1,
            "description": "bad input data"
        }
    })
})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
});