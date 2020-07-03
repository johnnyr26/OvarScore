'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var iModel = function () {
    //Creates an object with all of the responses that are about to come
    function iModel() {
        _classCallCheck(this, iModel);

        this.responses = { FIGO: null, RD: null, PFI: null, ECOG: null, CA125: null, ASCITES: null };
        this.error = 'There were either not enough entries to formulate a recommendation or one of the entries was invalid. Please try again.';
    }

    _createClass(iModel, [{
        key: 'validateRecommendation',
        value: function validateRecommendation(responses) {
            //validates the recommendation by aligning the user's response to the available responses and making sure they are all strings
            var options = {
                FIGO: ['I', 'II', 'III', 'IV'],
                RD: ['0', '>0'],
                PFI: ['<16', '≥16'],
                ECOG: ['0-1', '2-3'],
                CA125: ['>105', '≤105'],
                ASCITES: ['Present', 'Absent']
            };
            var notEmptyEntries = Object.entries(responses).length != 0;
            var validatedEntries = Object.values(responses).every(function (response, index) {
                return typeof response === 'string' && Object.values(options)[index].includes(response);
            });
            return notEmptyEntries && validatedEntries;
        }
    }, {
        key: 'calculateCumulativeScore',
        value: function calculateCumulativeScore(responses) {
            if (this.validateRecommendation(responses)) {
                //Calculates score
                var score = 0;
                var response = responses;
                var categoryScores = [{ response: response['FIGO'], options: ['III', 'IV'], score: 0.8 }, { response: response['RD'], options: ['>0'], score: 1.5 }, { response: response['PFI'], options: ['<16'], score: 2.4 }, { response: response['ECOG'], options: ['2-3'], score: 2.4 }, { response: response['CA125'], options: ['>105'], score: 1.8 }, { response: response['ASCITES'], options: ['Present'], score: 3 }];
                //Goes through each category and adds the score if the conditions match
                categoryScores.forEach(function (category) {
                    if (category['options'].includes(category['response'])) score += category['score'];
                });
                return score <= 4.7 ? 'Surgery (Score: ' + score.toFixed(1) + ')' : 'No surgery (Score: ' + score.toFixed(1) + ')';
            }
            //if the response doesn't have all of the correctly formated inputs
            return this.error;
        }
    }, {
        key: 'clearAll',
        value: function clearAll() {
            //clears responses
            this.responses = {};
        }
    }]);

    return iModel;
}();

module.exports = new iModel();