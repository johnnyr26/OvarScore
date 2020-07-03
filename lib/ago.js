'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AGO = function () {
    function AGO() {
        _classCallCheck(this, AGO);

        //Saved this and the noCategory to a variable so that if I need to change the spelling/wording, I can just go here
        this.categories = ['Disease-free interval > 6 months', 'Good Performance Status (ECOG = 0)', 'No Residuals After Primary Surgery (If Unknown FIGO stage I/II Initially)', 'No Or Small Volume Of Ascities (Estimation: < 500 mL)'];
        this.noCategory = 'Peritoneal Carcinomatosis?';
        this.recommendations = ['Surgery', 'No Surgery'];
    }

    _createClass(AGO, [{
        key: 'processNextResponse',
        value: function processNextResponse(responses) {
            //if the user has responded, then pull up the next quesiton. otherwise pull up the first category
            if (responses && Object.entries(responses).length != 0) {
                var questions = Object.keys(responses);
                var lastValue = Object.values(responses).slice(-1)[0];
                //if the 'peritoneal carcinomatosis' question was asked
                if (questions.slice(-1)[0] === this.noCategory)
                    //if the user response to 'peritoneal carcinomatosis' was no, then recommend surgery, otherwise recommend no surgery 
                    return lastValue === 'no' ? this.recommendations[0] : this.recommendations[1];
                if (lastValue === 'no') {
                    //If the user responded no to the first category, then automatically go to no surgery
                    if (questions.slice(-1)[0] === this.categories[0]) return this.recommendations[1];
                    //shoots the 'peritoneal' question to the user
                    return this.noCategory;
                }
                //finds the next category that the user hasn't responded to
                var nextCategory = this.categories.find(function (category) {
                    return !questions.includes(category);
                });
                //if the user hasn't responded to all of the categories, proceed
                if (nextCategory) return nextCategory;
                //if the user said yes to all of the categories, then recommend no surgery
                return this.recommendations[0];;
            }
            return this.categories[0];
        }
    }, {
        key: 'logResponse',
        value: function logResponse(question, response, responses) {
            var _this = this;

            //Checks to see if the question matches one of valid questions
            return new Promise(function (resolve, reject) {
                if (question === _this.noCategory || _this.categories.includes(question)) {
                    responses[question] = response;
                    resolve(responses);
                }
                reject('There was an error with the category');
            });
        }
    }, {
        key: 'clearAll',
        value: function clearAll() {
            //clears all responses
            this.responses = {};
            this.recommendation = '';
        }
    }]);

    return AGO;
}();

module.exports = new AGO();