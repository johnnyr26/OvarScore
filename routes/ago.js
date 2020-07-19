const express = require('express');
const router = express.Router();
const ago = require('../models/ago');
router.route('/')
    .get((req, res) => {
        res.render('ago');
    })
    .post((req, res) => {
        if(!ago.validateResponse(req.body)) return res.send({ error: 'There was an error processing the response' });
        return res.send(ago.processNextResponse(req.body.category, req.body.response));
    });
module.exports = router;