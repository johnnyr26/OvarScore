const express = require('express');
const app = express();
const helmet = require('helmet');
const ago = require('../models/ago');
const imodel = require('../models/imodel');
const fagotti = require('../models/fagotti');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    return res.render('index');
});
app.get('/ago', (req, res) => {
    return res.render('ago');
});
app.get('/imodel', (req,res) => {
    return res.render('imodel');
});
app.get('/fagotti', (req, res) => {
    return res.render('fagotti');
});
app.get('/*', (req, res) => {
    return res.render('404');
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
    return res.send({
        recommendation: fagotti.formulateRecommendation(score, Object.entries(req.body).length),
        score: fagotti.calculateScore(req.body)
    });
});
app.post('/imodel', (req, res) => {
    if(!imodel.validateResponses(req.body)) return res.send({ error: 'There was an error processing the responses' });
    return res.send({
        recommendation: imodel.formulateRecommendation(score, Object.entries(req.body).length),
        score: imodel.calculateScore(req.body)
    });
});
const port = process.env.PORT || 8080;
app.listen(port, console.log('Listening on 8080'));