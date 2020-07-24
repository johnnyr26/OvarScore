const express = require('express');
const router = express.Router();
const validateResponse = require('../utils/validate').ago;
const processNextResponse = require('../utils/process_response').ago;
router.route('/')
    .get((req, res) => {
        res.render('ago');
    })
    .post(async (req, res) => {
        const {category, response} = req.body;
        try {
            await validateResponse(category, response);
            const nextResponse = processNextResponse(category, response);
            return res.send(nextResponse);
        } catch (error) {
            return res.status(400).send({ error });
        }
    });
module.exports = router;