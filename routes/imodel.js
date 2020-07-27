const express = require('express');
const router = express.Router();
const validateResponse = require('../utils/validate').iModel;
const processResponse = require('../utils/process_response').iModel;
router.route('/')
    .get((req, res) => {
        res.render('imodel');
    })
    .post((req, res) => {
        const categories = req.body;
        if (!validateResponse(categories)) return res.status(400).send({ error: 'Error: There was an error processing the response.' });
        return res.send(processResponse(categories));
    });
module.exports = router;