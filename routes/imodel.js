const express = require('express');
const router = express.Router();
const validateResponse = require('../utils/validate').iModel;
const processResponse = require('../utils/process_response').iModel;
router.route('/')
    .get((req, res) => {
        res.render('imodel');
    })
    .post(async (req, res) => {
        const { FIGO, RD, PFI, ECOG, CA125, ASCITES } = req.body;
        const categories = { FIGO, RD, PFI, ECOG, CA125, ASCITES };
        try {
            await validateResponse(categories);
            const { score, recommendation } = processResponse(categories);
            return res.send({
                recommendation,
                score
            });
        } catch(error) {
            return res.status(400).send({ error });
        }
    });
module.exports = router;