const express = require('express');
const router = express.Router();
const validateResponse = require('../utils/validate').fagotti;
const processResponse = require('../utils/process_response').fagotti;
router.route('/')
    .get((req, res) => {
        res.render('fagotti');
    })
    .post(async (req, res) => {
        const { row0, row1, row2, row3, row4, row5, row6 } = req.body;
        const responses = { row0, row1, row2, row3, row4, row5, row6 };
        try {
            await validateResponse(responses);
            const { score, recommendation } = processResponse(responses);
            return res.send({
                recommendation,
                score
            });
        } catch(error) {
            return res.status(400).send({ error });
        }
    });
module.exports = router;