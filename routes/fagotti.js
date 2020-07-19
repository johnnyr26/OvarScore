const express = require('express');
const router = express.Router();
const fagotti = require('../models/fagotti');
router.route('/')
    .get((req, res) => {
        res.render('fagotti');
    })
    .post((req, res) => {
        if(!fagotti.validateResponse(req.body)) return res.send({ error: 'There was an error processing the responses' });
        const score = fagotti.calculateScore(req.body);
        return res.send({
            recommendation: fagotti.formulateRecommendation(score, Object.entries(req.body).length),
            score
        });
    });
module.exports = router;