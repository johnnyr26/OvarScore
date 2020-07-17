const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const user = require('../models/user');
const helmet = require('helmet');
const ago = require('../models/ago');
const imodel = require('../models/imodel');
const fagotti = require('../models/fagotti');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    name: 'sessionID',
    secret: '?H$ry`lqXy%yR2folh=6m:+M}to|It',
    store: new FileStore,
    resave: false,
    saveUninitialized: false
}));
app.use(helmet());
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    if(!req.session.user) return res.redirect('/login');
    return res.render('index', {
        name: req.session.name
    });
});
app.get('/ago', (req, res) => {
    if(!req.session.user) return res.redirect('/login');
    return res.render('ago');
});
app.get('/imodel', (req,res) => {
    if(!req.session.user) return res.redirect('/login');
    return res.render('imodel');
});
app.get('/fagotti', (req, res) => {
    if(!req.session.user) return res.redirect('/login');
    return res.render('fagotti');
});
app.get('/login', (req, res) => {
    if(req.session.error) {
        const error = req.session.error;
        delete req.session.error;
        return res.render('login', {
            error: error
        })
    }
    delete req.session.user;
    return res.render('login');
})
app.get('/logout', (req, res) => {
    const categories = ['name', 'email', 'user', 'error'];
    categories.forEach(category => delete req.session[category]);
    return res.redirect('/login');
})
app.get('/signup', (req, res) => {
    if(req.session.error) {
        const { name, email, error } = req.session
        const categories =  ['name', 'email', 'error'];
        categories.forEach(category => delete req.session[category]);
        return res.render('signup', {
            error: error,
            name: name,
            email: email
        })
    }
    return res.render('signup');
});
app.get('/*', (req, res) => {
    return res.render('404', {
        user: req.session.user
    });
});
app.post('/login', async (req,res) => {
    const email = req.body.username;
    const password = req.body.password;
    try {
        const hashedPassword = await user.findPassword(email);
        bcrypt.compare(password, hashedPassword, function(error, result) {
            if(error) {
                req.session.error = 'There was an error authenticating your account. Plese try again';
                return res.redirect('/login');
            }
            if(result) {
                req.session.user = email;
                req.session.name = user.users.find(user => user['email'] === email).name;
                return res.redirect('/');
            }
            req.session.error = 'Incorrect password. Please try again.';
            return res.redirect('/login')
        });
    } catch(error) {
        req.session.error = error; 
        return res.redirect('/login');
    }
});
app.post('/signup', async (req,res) => {
    //If all of the entries were in the correct format and everything is confirmed
    try {
        await bcrypt.hash(req.body.password, saltRounds, function(error, hashedPassword) {
            if(error) {
                ({ name: req.session.name, email: req.session.email } = req.body);
                req.session.error = "Error: The sign up credentials couldn't reach the database. Please try again.";
                return res.redirect('/signup');
            }
            req.body.password = hashedPassword;
        });
        await user.validateSignUpCredentials(req.body);
        ({ email: req.session.user, name: req.session.name} = req.body);
        return res.redirect('/');
    } catch (error) {
        ({ name: req.session.name, email: req.session.email } = req.body);
        req.session.error = error;
        return res.redirect('/signup');
    }
});
app.post('/ago', (req, res) => {
    if(!ago.validateResponse(req.body)) return res.send({ error: 'There was an error processing the response' });
    const nextCategory = ago.processNextResponse(req.body);
    const nextSubCategory = ago.subCategories[ago.categories.findIndex(category => nextCategory === category)] || '';
    const nextResponse = {
        category: nextCategory,
        subCategory: nextSubCategory,
        responses: ['yes', 'no']
    }
    if(ago.recommendations.includes(nextResponse.category)) nextResponse['recommendation'] = nextCategory;
    return res.send(nextResponse);
});
app.post('/fagotti', (req, res) => {
    if(!fagotti.validateResponse(req.body)) return res.send({ error: 'There was an error processing the responses' });
    const score = fagotti.calculateScore(req.body);
    return res.send({
        recommendation: fagotti.formulateRecommendation(score, Object.entries(req.body).length),
        score: score
    });
});
app.post('/imodel', (req, res) => {
    if(!imodel.validateResponses(req.body)) return res.send({ error: 'There was an error processing the responses' });
    const score = imodel.calculateScore(req.body);
    return res.send({
        recommendation: imodel.formulateRecommendation(score, Object.entries(req.body).length),
        score: score
    });
});
const port = process.env.PORT || 8080;
app.listen(port, console.log('Listening on 8080'));