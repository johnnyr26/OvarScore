class iModel {
    //Creates an object with all of the responses that are about to come
    constructor() {
        this.error = 'There were either not enough entries to formulate a recommendation or one of the entries was invalid. Please try again.';
    }
    validateResponses(responses) {
        //validates the responses by aligning the user's response to the available responses and making sure they are all strings
        const options = {
            FIGO: ['I', 'II', 'III', 'IV'], 
            RD: ['0', '>0'],  
            PFI: ['<16', '≥16'], 
            ECOG: ['0-1', '2-3'],
            CA125: ['>105', '≤105'],
            ASCITES: ['Present', 'Absent']
        };
        //Makes sure that the correct keys are aligned with the corrrect value
        const properKeys = Object.keys(responses).every(key => options[key]);
        //makes sure that the validated values are aligned with the validated keys
        return properKeys ? Object.keys(responses).every(key => options[key].includes(responses[key])) : false;
    }
    calculateScore(responses) {
        let score = 0;
        const response = responses;
        const categoryScores = [
            {response: response['FIGO'], options: ['III','IV'], score: 0.8},
            {response: response['RD'], options: ['>0'], score: 1.5},
            {response: response['PFI'], options: ['<16'], score: 2.4},
            {response: response['ECOG'], options: ['2-3'], score: 2.4},
            {response: response['CA125'], options: ['>105'], score: 1.8},
            {response: response['ASCITES'], options: ['Present'], score: 3}
        ];
        //Goes through each category and adds the score if the conditions match
        categoryScores.forEach(category => {
            if(category['options'].includes(category['response'])) score += category['score'];
        });
        //The score gets calculated based on the responses given
        //If all of the responses are given, then a recommendation will also be given
        return score.toFixed(1);
    }
    formulateRecommendation(score, responsesLength) {
        //formulates a recommendation based on inputs
        if(responsesLength === 6) {
            return score <= 4.7 ? `Recommendation: Surgery` : `Recommendation: No surgery`;
        }
        return null;
    }
}
module.exports = new iModel();