class iModel {
    //Creates an object with all of the responses that are about to come
    constructor(FIGO, RD, PFI, ECOG, CA125, ASCITES) {
        this.responses = {FIGO: FIGO, RD: RD, PFI: PFI, ECOG: ECOG, CA125: CA125, ASCITES: ASCITES};
    }
    validateRecommendation() {
        //validates the recommendation by aligning the user's response to the available responses and making sure they are all strings
        const options = {
            FIGO: ['I', 'II', 'III', 'IV'], 
            RD: ['0', '>0'],  
            PFI: ['<16', '≥16'], 
            ECOG: ['0-1', '2-3'],
            CA125: ['>105', '≤105'],
            ASCITES: ['Present', 'Absent']
        }
        return Object.values(this.responses).every((response, index) => typeof response === 'string' && Object.values(options)[index].includes(response));;
    }
    calculateCumulativeScore() {
        if(this.validateRecommendation()) {
            //Calculates score
            let score = 0;
            const response = this.responses;
            /*
                make options an array 
                if options isn't an array, when the RD category comes up
                then the score will always add 1.5 due to the fact that 
                0 is included in >0
            */
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
            return score <= 4.7 ? `Surgery (Score: ${score.toFixed(1)})` : `No surgery (Score: ${score.toFixed(1)})`;
        }
        //if the response doesn't have all of the correctly formated inputs
        return 'There were either not enough entries to formulate a recommendation or one of the entries was invalid. Please try again.';
    }
    clearAll() {
        //clears responses
        this.responses = {};
    }
}
module.exports = new iModel();