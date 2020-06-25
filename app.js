const express = require('express');
const app = new express;
const fs = require('fs');
const score = require('./score.js');
const ago = score.ago;
const imodel = score.iModel;
app.use(express.urlencoded({extended: true}));
app.get('/', (req, res) => {
    fs.readFile('index.html', {encoding: 'utf-8'}, (err, body)  => {
        if(err) {
            return res.send('404');
        }
        return res.send(body);
    });
});
app.get('/ago', (req, res) => {
    fs.readFile('ago.html', {encoding: 'utf-8'}, (err, body)  => {
        if(err) {
            return res.send('404');
        }
        let nextResponse = ago.processNextResponse(ago.responses);
        return res.send(body.replace(/{{category}}/g, nextResponse));
    });
});
app.get('/imodel', (req,res) => {
    fs.readFile('imodel.html', {encoding: 'utf-8'}, (err,body) => {
        if(err) {
            return res.send('404');
        }
        return res.send(body);
    });
});
app.get('/recommendation', (req, res) => {
    fs.readFile('recommendation.html', {encoding: 'utf-8'}, (err, body) => {
        if(err) {
            return res.send('404');
        }
        const recommendation = ago.recommendation || imodel.calculateCumulativeScore();
        ago.clearAll();
        imodel.clearAll();
        return res.send(body.replace('{{recommendation}}', recommendation));
    });
});
app.post('/ago', (req, res) => {
    fs.readFile('ago.html', {encoding: 'utf8'}, (error, body) => {
        const category = req.body.category;
        const response = req.body.yes || req.body.no;
        responses = ago.logResponse(category, response, ago.responses);
        if(ago.recommendations.includes(ago.recommendation)) {
            return res.redirect('/recommendation');
        }
        return res.redirect('/ago');
    });
});
app.post('/imodel', (req, res) => {
    fs.readFile("imodel.html", {encoding: 'utf-8'}, (err,body) => {
        if(err) {
            return res.send('404');
        }
        const FIGO = req.body.FIGO;
        const RD = req.body.RD;
        const PFI = req.body.PFI;
        const ECOG = req.body.ECOG;
        const CA125 = req.body.CA125;
        const ASCITES = req.body.ASCITES;
        imodel.responses = {FIGO: FIGO, RD: RD, PFI: PFI, ECOG: ECOG, CA125: CA125, ASCITES: ASCITES};
        if(imodel.validateRecommendation()) {
            return res.redirect('/recommendation');
        }
        return res.redirect('/');
    });
});
const port = process.env.PORT || 8080;
app.listen(port, console.log('Listening on  8080'));