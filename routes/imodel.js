const express = require('express');
const router = express.Router();
const imodel = require('../models/imodel');
router.route('/')
    .get((req, res) => {
        res.render('imodel');
    })
    .post((req, res) => {
        if(!imodel.validateResponses(req.body)) return res.send({ error: 'There was an error processing the responses' });
        const score = imodel.calculateScore(req.body);
        return res.send({
            recommendation: imodel.formulateRecommendation(score, Object.entries(req.body).length),
            score
        });
    });
module.exports = router;