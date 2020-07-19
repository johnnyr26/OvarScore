const express = require('express');
const router = express.Router();
const ago = require('../models/ago');
router.route('/')
    .get((req, res) => {
        res.render('ago');
    })
    .post((req, res) => {
        if(!ago.validateResponse(req.body)) return res.send({ error: 'There was an error processing the response' });
        const nextCategory = ago.processNextResponse(req.body);
        const nextSubCategory = ago.subCategories[ago.categories.findIndex(category => nextCategory === category)] || '';
        const nextResponse = {
            category: nextCategory,
            subCategory: nextSubCategory,
            responses: ['yes', 'no'],
        }
        if(ago.recommendations.includes(nextResponse.category)) nextResponse['recommendation'] = nextCategory;
        return res.send(nextResponse);
    });
module.exports = router;