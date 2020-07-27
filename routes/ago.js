const express = require('express');
const router = express.Router();
const validateResponse = require('../utils/validate').ago;
const processNextResponse = require('../utils/process_response').ago;
router.route('/')
    .get((req, res) => {
        res.render('ago');
    })
    .post((req, res) => {
        const { category, response } = req.body;
        if (!validateResponse(category, response)) return res.status(400).send({ error: 'Error: There was an error processing the response.' });
        return res.send(processNextResponse(category, response));
    });
module.exports = router;