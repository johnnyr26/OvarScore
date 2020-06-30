const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs = require('fs');
const user = require('../models/user.js');
const ago = require('../models/ago.js');
const imodel = require('../models/iModel.js');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'uhh...this is a secret?',
    store: new FileStore,
    resave: false,
    saveUninitialized: false
}));
app.get('/', (req, res) => {
    fs.readFile('views/index.html', {encoding: 'utf-8'}, (err, body)  => {
        if(err) return res.status(404).send('404');
        if(!req.session.user) return res.redirect('/login');
        return res.send(body);
    });
});
app.get('/ago', (req, res) => {
    fs.readFile('views/ago.html', {encoding: 'utf-8'}, (err, body)  => {
        if(err) return res.status(404).send('404');
        //Process and display the next category
        if(!req.session.user) return res.redirect('/login');
        let nextResponse = ago.processNextResponse(ago.responses);
        return res.send(body.replace(/{{category}}/g, nextResponse));
    });
});
app.get('/imodel', (req,res) => {
    fs.readFile('views/imodel.html', {encoding: 'utf-8'}, (err,body) => {
        if(!req.session.user) return res.redirect('/login');
        return err ? res.status(404).send('404') : res.send(body);
    });
});
app.get('/recommendation', (req, res) => {
    fs.readFile('views/recommendation.html', {encoding: 'utf-8'}, (err, body) => {
        if(err) return res.status(404).send('404');
        //Retrieves reommendation based on the ago model or the imodel
        if(!req.session.user) return res.redirect('/login');
        const recommendation = ago.recommendation || imodel.calculateCumulativeScore();
        //Clears the recommendation
        ago.clearAll();
        imodel.clearAll();
        return res.send(body.replace('{{recommendation}}', recommendation));
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
        return res.send(body.replace('{Error Message}', ''));
    })
})
app.get('/logout', (req, res) => {
    delete req.session.user;
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
        if(err) return err;
        const email = req.body.username;
        const password = req.body.password;
        try {
            await user.logInUser(email, password);
            req.session.user = user.email;
            res.redirect('/');
        } catch(error) {
            req.session.error = error; 
            return res.redirect('/login');
        }
    });
});
app.post('/signup', (req,res) => {
    fs.readFile('views/signup.html', {encoding: 'utf-8'}, async (err, body) => {
        if(err) return res.status(404).send('404');
        user.signUpCredentials = req.body;
        //If all of the entries were in the correct format and everything is confirmed
        try {
            await user.validateSignUpCredentials();
            user.logInUser(user.email, user.password);
            req.session.user = user.email;
            return res.redirect('/');
        } catch (error) {
            req.session.name = user.name;
            req.session.email = user.email;
            req.session.error = error;
            return res.redirect('/signup');
        }
    });
});
app.post('/ago', (req, res) => {
    fs.readFile('views/ago.html', {encoding: 'utf8'}, (error, body) => {
        //Retrieves the response to each category
        const category = req.body.category;
        const response = req.body.yes || req.body.no;
        //Logs user response
        responses = ago.logResponse(category, response, ago.responses);
        //If a recommendation has been made, redirect to the recommendation page
        return ago.recommendations.includes(ago.recommendation) ? res.redirect('/recommendation') : res.redirect('/ago');
    });
});
app.post('/imodel', (req, res) => {
    fs.readFile('views/imodel.html', {encoding: 'utf-8'}, (err,body) => {
        if(err) return res.status(404).send('404');
        //Saves the user repsonse to an object in the imodel
        imodel.responses = {
            FIGO: req.body.FIGO,
            RD: req.body.RD, 
            PFI: req.body.PFI, 
            ECOG: req.body.ECOG, 
            CA125: req.body.CA125, 
            ASCITES: req.body.ASCITES
        };
        //if all of the user recommendations were valid
        return imodel.validateRecommendation() ? res.redirect('/recommendation') : res.redirect('/');
    });
});
const port = process.env.PORT || 8080;
app.listen(port, console.log('Listening on  8080'));