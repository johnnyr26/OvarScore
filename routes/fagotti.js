const express = require('express');
const router = express.Router();
const validateResponse = require('../utils/validate').fagotti;
const processResponse = require('../utils/process_response').fagotti;
router.route('/')
    .get((req, res) => {
        res.render('fagotti');
    })
    .post((req, res) => {
        const responses = req.body;
        if (!validateResponse(responses)) return res.status(400).send({ error: 'Error: There was an error processing the response.' });
        return res.send(processResponse(responses));
    });
module.exports = router;