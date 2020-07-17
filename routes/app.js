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
    delete req.session.recommendation;
    delete req.session.responses;
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
    const categories = ['name', 'email', 'user', 'recommendation', 'responses', 'error'];
    categories.forEach(category => delete req.session[category]);
    return res.redirect('/login');
})
app.get('/signup', (req, res) => {
    if(req.session.error) {
        const name = req.session.name.trim();
        const email = req.session.email.trim();
        const error = req.session.error;
        delete req.session.name;
        delete req.session.email;
        delete req.session.error;
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
        await bcrypt.hash(req.body['password'], saltRounds, function(error, hashedPassword) {
            if(error) {
                req.session.name = req.body['name'];
                req.session.email = req.body['email'];
                req.session.error = "Error: The sign up credentials couldn't reach the database. Please try again.";
                return res.redirect('/signup');
            }
            req.body['password'] = hashedPassword;
        });
        user.signUpCredentials = req.body;
        await user.validateSignUpCredentials();
        req.session.user = user.email;
        req.session.name = user.name;
        delete user.name;
        delete user.email;
        delete user.password;
        return res.redirect('/');
    } catch (error) {
        req.session.name = user.name;
        req.session.email = user.email;
        req.session.error = error;
        return res.redirect('/signup');
    }
});
app.post('/ago', async (req, res) => {
    //Retrieves the response to each category
    const { category, value } = req.body;
    //Logs user response
    try {
        if(!req.session.responses) req.session.responses = {};
        const loggedResponse = await ago.logResponse(category, value, req.session.responses);
        req.session.responses = loggedResponse;
        //If a recommendation has been made, redirect to the recommendation page
        const nextCategory = ago.processNextResponse(loggedResponse);
        const nextSubCategory = ago.subCategories[ago.categories.findIndex(category => nextCategory === category)] || '';
        const nextResponse = {
            category: nextCategory,
            subCategory: nextSubCategory,
            responses: ['yes', 'no']
        }
        if(ago.recommendations.includes(nextResponse.category)) nextResponse['recommendation'] = nextCategory;
        return res.send(nextResponse);
    } catch(error) {
        return res.send({ error });
    }
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
    req.session.responses = req.body;
    //Validate response before deleting the empty responses so that if the user clicks something other than the first,
    //the program can process the results by the correct  index
    if(!imodel.validateResponses(req.session.responses)) return res.send({ error: 'There was an error processing the responses' });
    Object.keys(req.session.responses).forEach(key => {
        if(!req.session.responses[key]) delete req.session.responses[key];
    });
    const score = imodel.calculateScore(req.session.responses);
    return res.send({
        recommendation: imodel.formulateRecommendation(score, Object.entries(req.session.responses).length),
        score: score
    });
});
const port = process.env.PORT || 8080;
app.listen(port, console.log('Listening on 8080'));