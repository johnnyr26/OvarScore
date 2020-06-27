const express = require('express');
const app = express();
const fs = require('fs');
const user = require('../models/user.js');
const ago = require('../models/ago.js');
const imodel = require('../models/iModel.js');
app.use(express.urlencoded({extended: true}));
app.get('/', (req, res) => {
    fs.readFile('views/index.html', {encoding: 'utf-8'}, (err, body)  => {
        if(err) return res.status(404).send('404');
        if(!user.checkUser(req.query.user)) return res.redirect('/login');
        return res.send(body);
    });
});
app.get('/ago', (req, res) => {
    fs.readFile('views/ago.html', {encoding: 'utf-8'}, (err, body)  => {
        if(err) return res.status(404).send('404');
        //Process and display the next category
        if(!user.checkUser(req.query.user)) return res.redirect('/login');
        let nextResponse = ago.processNextResponse(ago.responses);
        return res.send(body.replace(/{{category}}/g, nextResponse));
    });
});
app.get('/imodel', (req,res) => {
    fs.readFile('views/imodel.html', {encoding: 'utf-8'}, (err,body) => {
        if(!user.checkUser(req.query.user)) return res.redirect('/login');
        return err ? res.status(404).send('404') : res.send(body);
    });
});
app.get('/recommendation', (req, res) => {
    fs.readFile('views/recommendation.html', {encoding: 'utf-8'}, (err, body) => {
        if(err) return res.status(404).send('404');
        //Retrieves reommendation based on the ago model or the imodel
        if(!user.checkUser(req.query.user)) return res.redirect('/login');
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
        if(req.query.error) return res.send(body.replace('{Error Message}', req.query.error));
        return res.send(body.replace('{Error Message}', ''));
    })
})
app.get('/signup', (req, res) => {
    fs.readFile('views/signup.html', {encoding: 'utf-8'}, (err, body) => {
        if(err) return res.status(404).send('404');
        if(req.query.error) return res.send(body.replace('{Error Message}', req.query.error));
        return res.send(body.replace('{Error Message}', ''));
    });
});
app.post('/login', (req,res) => {
    fs.readFile('views/login.html', {encoding: 'utf-8'}, (err, body) => {
        if(err) return err;
        const email = req.body.username;
        const password = req.body.password;
        if(user.logInUser(email, password) != user.errorMessages[3]) return res.redirect(`/?user=${email}`);
        return res.redirect(`/login/?error=${user.errorMessages[3]}`);
    });
});
app.post('/signup', (req,res) => {
    fs.readFile('views/signup.html', {encoding: 'utf-8'}, (err, body) => {
        if(err) return res.status(404).send('404');
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;
        user.rePassword = req.body.rePassword;
        //If all of the entries were in the correct format and everything is confirmed
        if(!user.errorMessages.includes(user.validateSignUpCredentials())) {
            user.logInUser(user.email, user.password);
            return res.redirect(`/?=${user.email}`);
        }
        return res.redirect(`/signup/?error=${user.validateSignUpCredentials()}`);
    })
})
app.post('/ago', (req, res) => {
    fs.readFile('views/ago.html', {encoding: 'utf8'}, (error, body) => {
        //Retrieves the response to each category
        const category = req.body.category;
        const response = req.body.yes || req.body.no;
        //Logs user response
        responses = ago.logResponse(category, response, ago.responses);
        //If a recommendation has been made, redirect to the recommendation page
        const user = req.query.user;
        return ago.recommendations.includes(ago.recommendation) ? res.redirect(`/recommendation/?user=${user}`) : res.redirect(`/ago/?user=${user}`);
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
        const user = req.query.user;
        return imodel.validateRecommendation() ? res.redirect(`/recommendation/?user=${user}`) : res.redirect(`/?=${user.email}`);
    });
});
const port = process.env.PORT || 8080;
app.listen(port, console.log('Listening on  8080'));