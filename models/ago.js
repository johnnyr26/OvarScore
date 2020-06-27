class AGO {
    constructor() {
        this.preReq = 'Patients With Disease-Free Interval > 6 Months:';
        //Saved this and the noCategory to a variable so that if I need to change the spelling/wording, I can just go here
        this.categories = [
            'Good Performance Status (ECOG = 0)', 
            'No Residuals After Primary Surgery (If Unknown FIGO stage I/II (Initially)',
            'No Or Small Volume Of Ascities (Estimation: < 500 mL)',
        ]
        this.noCategory = 'Peritoneal Carcinomatosis?';
        this.recommendations = ['Surgery', 'No Surgery'];
        this.recommendation = '';
        this.responses = {};
    }
    processNextResponse() {
        //if the user has responded, then pull up the next quesiton. Otherwise pull up the first category
        if(this.responses && Object.entries(this.responses).length != 0) {
            const questions = Object.keys(this.responses);
            const lastValue = Object.values(this.responses).slice(-1)[0];
            //if the 'peritoneal carcinomatosis' question was asked
            if(questions.slice(-1)[0] === this.noCategory)
                //if the user response to 'peritoneal carcinomatosis' was no, then recommend surgery, otherwise recommend no surgery 
                return lastValue === 'no' ? this.recommendation = this.recommendations[0] : this.recommendation  = this.recommendations[1];
            //shoots the 'peritoneal' question to the user
            if(lastValue === 'no') return this.noCategory;
            //finds the next category that the user hasn't responded to
            let nextCategory = this.categories.find(category => !questions.includes(category));
            //if the user hasn't responded to all of the categories, proceed
            if(nextCategory) return nextCategory;
            //if the user said yes to all of the categories, then recommend no surgery
            return this.recommendation = this.recommendations[0];
        }
        return this.categories[0];
    }
    logResponse(question, response, responses) {
        //Checks to see if the question matches one of valid questions
        if(question === this.noCategory || this.categories.includes(question)) {
            //logs response and proceed to the next category/recommendation
            this.responses[question] = response;
            return this.processNextResponse();
        }
        return 'Question does not match any of the categories';
    }
    clearAll() {
        //clears all responses
        this.responses = {};
        this.recommendation = '';
    }
}
module.exports = new AGO();