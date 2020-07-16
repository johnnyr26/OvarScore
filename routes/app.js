const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
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
app.get('/', (req, res) => {
    fs.readFile('views/index.html', {encoding: 'utf-8'}, (error, body)  => {
        if(error) return res.status(404).send('404');
        delete req.session.recommendation;
        delete req.session.responses;
        return res.send(body);
    });
});
app.get('/ago', (req, res) => {
    fs.readFile('views/ago.html', {encoding: 'utf-8'}, (error, body)  => {
        if(error) return res.status(404).send('404');
        if(!req.session.user) return res.redirect('/login');
        return res.send(body);
    });
});
app.get('/imodel', (req,res) => {
    fs.readFile('views/imodel.html', {encoding: 'utf-8'}, (error, body) => {
        if(error) return res.status(404).send('404');
        if(!req.session.user) return res.redirect('/login');
        return error ? res.status(404).send('404') : res.send(body);
    });
});
app.get('/fagotti', (req, res) => {
    fs.readFile('views/fagotti.html', {encoding: 'utf-8'}, (error, body) => {
        if(error) return res.status(404).send('404');
        return res.send(body);
    });
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
    if(!req.session.responses) req.session.responses = {};
    const { FIGO, RD, PFI, ECOG, CA125, ASCITES } = req.body;
    req.session.responses = { FIGO, RD, PFI, ECOG, CA125, ASCITES };
    //Validate reposnse before deleting the empty responses so that if the user clicks something other than the first, the program can process the results by the correct  index
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