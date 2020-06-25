class AGO {
    constructor() {
        this.preReq = 'Patients With Disease-Free Interval > 6 Months:';
        this.categories = [
            'Good Performance Status (ECOG = 0)', 
            'No Residuals After Primary Surgery (If Unknown FIGO stage I/II (Initially)',
            'No Or Small Volume Of Ascities (Estimation: < 500 mL)',
        ]
        this.noCategory = 'Peritoneal Carcinomatosis?';
        this.responses = {};
        this.recommendations = ['Surgery', 'No Surgery'];
        this.recommendation = '';
    }
    processNextResponse() {
        if(this.responses && Object.entries(this.responses).length != 0) {
            const questions = Object.keys(this.responses);
            const lastValue = Object.values(this.responses).slice(-1)[0];
            if(questions.slice(-1)[0] === this.noCategory) {
                if(lastValue === 'no') {
                    return this.recommendation = this.recommendations[0];
                }
                return this.recommendation  = this.recommendations[1];
            }
            if(lastValue === 'no') {
                return this.noCategory;
            }
            let nextQuestion = this.categories.find(category => !questions.includes(category));
            if(nextQuestion) {
                return nextQuestion;
            }
            return this.recommendation = this.recommendations[0];
        } else {
            return this.categories[0];
        }
    }
    logResponse(question, response, responses) {
        if(question === this.noCategory || this.categories.includes(question)) {
            this.responses[question] = response;
            console.log(this.responses);
            return this.processNextResponse();
        }
        return 'Question does not match any of the categories';
    }
    clearAll() {
        this.responses = {};
        this.recommendation = '';
    }
}
class iModel {
    constructor(FIGO, RD, PFI, ECOG, CA125, ASCITES) {
        this.responses = {FIGO: FIGO, RD: RD, PFI: PFI, ECOG: ECOG, CA125: CA125, ASCITES: ASCITES};
        //Makes all of the categories RADIO (zero or more than zero, less than sixteen or more than sixteen...)
        //ECOG Category, make two radios: 0-1, 2-3
    }
    validateRecommendation() {
        const FIGOOptions = ['I', 'II', 'III', 'IV'];
        const RDOptions = ['0', '>0'];
        const PFIOptions = ['<16', '≥16'];
        const ECOGOptions = ['0-1', '2-3'];
        const CA125Options = ['>105', '≤105'];
        const ASCITESOptions = ['Present', 'Absent'];
        const allOptions = [FIGOOptions, RDOptions, PFIOptions, ECOGOptions, CA125Options, ASCITESOptions];
        return Object.values(this.responses).every((response, index) => typeof response === 'string' && allOptions[index].includes(response));;
    }
    calculateCumulativeScore() {
        if(this.validateRecommendation()) {
            let score = 0;
            const response = this.responses;
            if(response['FIGO'] === 'III' || response['FIGO'] === 'IV') {
                score += 0.8;
            }
            if(response['RD'] === '>0') {
                score += 1.5;
            }
            if(response['PFI'] === '<16') {
                score += 2.4;
            }
            if(response['ECOG'] === '2-3') {
                score += 2.4;
            }
            if(response['CA125'] === '>105') {
                score += 1.8;
            }
            if(response['ASCITES'] === 'Present') {
                score += 3;
            }
            if(score <= 4.7) {
                return `Surgery (Score: ${score.toFixed(1)})`;
            } else {
                return `No surgery (Score: ${score.toFixed(1)})`;
            }
        }
        return 'There were not enough entries to formulate a recommendation. Try again.';
    }
    clearAll() {
        this.responses = {};
    }
}
module.exports.ago = new AGO();
module.exports.iModel = new iModel();