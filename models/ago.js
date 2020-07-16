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
        if(responses && Object.entries(responses).length != 0) {
            const questions = Object.keys(responses);
            const lastValue = Object.values(responses).slice(-1)[0];
            //if the 'peritoneal carcinomatosis' question was asked
            if(questions.slice(-1)[0] === this.noCategory)
                //if the user response to 'peritoneal carcinomatosis' was no, then recommend surgery, otherwise recommend no surgery 
                return lastValue === 'no' ? this.recommendations[0] : this.recommendations[1];
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
            return this.recommendations[0];;
        }
        return this.categories[0];
    }
    logResponse(category, response, responses) {
        //Checks to see if the question matches one of valid questions
        return new Promise((resolve, reject) => {
            if(category === this.noCategory || this.categories.includes(category) && (response === 'no' || response === 'yes')) {
                //This function adjusts the responses so that they are in the proper order needed to determine the score
                const index = this.categories.findIndex(categoryArrayItem => categoryArrayItem === category);
                //this loop is only meant if the user went back to change an entry
                //this way the entries are in the correct order if the user goes back
                if(index !== -1) {
                    for(let i = index; i < this.categories.length; i++) {
                        delete responses[this.categories[i]]
                    }
                }
                //the PC category got deleted so that the responses can be in the proper order
                //if the user clicked a response for PC, then 
                delete responses['Peritoneal Carcinomatosis?'];
                //adds the response to the category
                responses[category] = response;
                resolve(responses);
            } 
            //one of the new categories or response is not formatted properly
            reject('There was an error with processing the response. Please try again.');
        });
    }
}
module.exports = new AGO();