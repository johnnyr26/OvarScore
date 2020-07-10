const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const user = require('../models/user.js');
const ago = require('../models/ago.js');
const imodel = require('../models/imodel.js');
const fagotti = require('../models/fagotti.js');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    name: 'Session-ID',
    secret: '?H$ry`lqXy%yR2folh=6m:+M}to|It',
    store: new FileStore,
    resave: false,
    saveUninitialized: false
}));
app.get('/', (req, res) => {
    fs.readFile('views/index.html', {encoding: 'utf-8'}, (err, body)  => {
        if(err) return res.status(404).send('404');
        if(!req.session.user) return res.redirect('/login');
        delete req.session.recommendation;
        delete req.session.responses;
        return res.send(body.replace('{{name}}', req.session.name));
    });
});
app.get('/agonextresponse', (req, res) => {
    const nextCategory = ago.processNextResponse(req.session.responses);
    const nextSubCategory = ago.subCategories[ago.categories.findIndex(category => nextCategory === category)] || '';
    const nextResponse = {
        category: nextCategory,
        subCategory: nextSubCategory,
        responses: ['yes', 'no']
    }
    if(ago.recommendations.includes(nextResponse.category)) nextResponse['recommendation'] = nextCategory;
    return res.send(nextResponse);
})
app.get('/ago', (req, res) => {
    fs.readFile('views/ago.html', {encoding: 'utf-8'}, (err, body)  => {
        return res.send(body);
    });
});
app.get('/imodel', (req,res) => {
    fs.readFile('views/imodel.html', {encoding: 'utf-8'}, (err,body) => {
        if(!req.session.user) return res.redirect('/login');
        return err ? res.status(404).send('404') : res.send(body);
    });
});
app.get('/fagotti', (req, res) => {
    fs.readFile('views/fagotti.html', {encoding: 'utf-8'}, (err, body) => {
        if(err) return res.status(404).send('404');
        if(!req.session.user) return res.redirect('/login');
        return res.send(body);
    });
});
app.get('/login', (req, res) => {
    fs.readFile('views/login.html', {encoding: 'utf-8'}, (err, body) => {
        if(err) return res.status(404).send('404');
        if(req.session.error) {
            const error = req.session.error;
            delete req.session.error;
            return res.send(body.replace('{Error Message}', error));
        }
        delete req.session.user;
        return res.send(body.replace('{Error Message}', ''));
    })
})
app.get('/logout', (req, res) => {
    const categories = ['name', 'email', 'user', 'recommendation', 'responses', 'error'];
    categories.forEach(category => delete req.session[category]);
    return res.redirect('/');
})
app.get('/signup', (req, res) => {
    fs.readFile('views/signup.html', {encoding: 'utf-8'}, (err, body) => {
        if(err) return res.status(404).send('404');
        if(req.session.error) {
            const name = req.session.name.trim();
            const email = req.session.email.trim();
            const error = req.session.error;
            delete req.session.name;
            delete req.session.email;
            delete req.session.error;
            return res.send(body.replace('{Error Message}', error).replace('{name}', name).replace('{email}', email));
        }
        return res.send(body.replace('{Error Message}', '').replace('{name}', '').replace('{email}', ''));
    });
});
app.post('/login', (req,res) => {
    fs.readFile('views/login.html', {encoding: 'utf-8'}, async (err, body) => {
        if(err) {
            req.session.error = "There was an error authenticating your account. Plese try again";
            return res.redirect('/login');
        };
        const email = req.body.username;
        const password = req.body.password;
        try {
            const hashedPassword = await user.findPassword(email);
            bcrypt.compare(password, hashedPassword, function(err, result) {
                if(err) {
                    req.session.error = "There was an error authenticating your account. Plese try again";
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
});
app.post('/signup', (req,res) => {
    fs.readFile('views/signup.html', {encoding: 'utf-8'}, async (err, body) => {
        if(err) return res.status(404).send('404');
        //If all of the entries were in the correct format and everything is confirmed
        try {
            await bcrypt.hash(req.body['password'], saltRounds, function(err, hashedPassword) {
                if(err) {
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
});
app.post('/ago', async (req, res) => {
    //Retrieves the response to each category
    const category = req.body.category;
    const response = req.body.value;
    //Logs user response
    try {
        if(!req.session.responses) req.session.responses = {};
        const loggedResponse = await ago.logResponse(category, response, req.session.responses);
        req.session.responses = loggedResponse;
        //If a recommendation has been made, redirect to the recommendation page
        return res.redirect('/agonextresponse');
    } catch(error) {
        res.session.error = error;
        return res.redirect('/');
    }
});
app.post('/fagotti', (req, res) => {
    const score = fagotti.calculateScore(req.body);
    return res.send({
        recommendation: fagotti.formulateRecommendation(score, Object.entries(req.body).length),
        score: score
    });
});
app.post('/imodel', (req, res) => {
    if(!req.session.responses) req.session.responses = {};
    req.session.responses = {
        FIGO: req.body.FIGO,
        RD: req.body.RD, 
        PFI: req.body.PFI, 
        ECOG: req.body.ECOG, 
        CA125: req.body.CA125, 
        ASCITES: req.body.ASCITES
    };
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