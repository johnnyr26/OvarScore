class AGO {
    constructor() {
        //Saved this and the noCategory to a variable so that if I need to change the spelling/wording, I can just go here
        this.categories = [
            'Disease-free interval > 6 months',
            'Good Performance Status', 
            'No Residuals After Primary Surgery',
            'No Or Small Volume Of Ascities'
        ];
        this.subCategories = [
            null,
            '(ECOG = 0)',
            '(If Unknown FIGO stage I/II Initially)',
            '(Less than < 500 mL)'
        ]
        this.noCategory = 'Peritoneal Carcinomatosis?';
        this.recommendations = ['Surgery', 'No Surgery'];
    }
    processNextResponse(responses) {
        //if the user has responded, then pull up the next quesiton. otherwise pull up the first category
        const questions = Object.keys(responses);
        const lastValue = Object.values(responses).slice(-1)[0];
        //if the 'peritoneal carcinomatosis' question was asked
         //if the user response to 'peritoneal carcinomatosis' was no, then recommend surgery, otherwise recommend no surgery
        if(questions.slice(-1)[0] === this.noCategory) return lastValue === 'no' ? this.recommendations[0] : this.recommendations[1];
        if(lastValue === 'no')  {
            //If the user responded no to the first category, then automatically go to no surgery
            if(questions.slice(-1)[0] === this.categories[0]) return this.recommendations[1];
            //shoots the 'peritoneal' question to the user
            return this.noCategory;
        }
        //finds the next category that the user hasn't responded to
        let nextCategory = this.categories.find(category => !questions.includes(category));
        //if the user hasn't responded to all of the categories, proceed
        if(nextCategory) return nextCategory;
        //if the user said yes to all of the categories, then recommend no surgery
        return this.recommendations[0];
    }
    validateResponse(response) {
        //Checks to see if the question matches one of valid questions
        const validCategories = Object.keys(response).every(category => this.categories.includes(category) || category === this.noCategory);
        const validResponses = Object.values(response).every(res => res === 'yes' || res ===  'no');
        return validCategories && validResponses;
    }
}
module.exports = new AGO();