class Fagotti {
    constructor() {
        //lists all of the possible options for fagotti page
        this.twoCategory = [
            'Unresectable massive peritoneal involvement plus miliary pattern of distribution',
            'Widespread infiltrating carcinomatosis or confluent nodules to most of the diaphragmatic surface',
            'Large infiltrating nodules or involvement of the root of the mesentery assumed based on limited movements of various intestinal segments',
            'Tumour diffusion up to the large curvature of the stomach',
            'Bowel resection assumed to be required or military carcinomatosis at the mesentric junction',
            'Obvious neoplasyic involvement of the gastric wall',
            'Any surface lesions'
        ];
        this.zeroCategory = [
            'Carcinomatosis involving a limited area surgically removable by peritonectomy',
            'Isolated diaphragmatic disease',
            'Small nodules potentially treatable with argon-beam coagulation',
            'Isolated omental disease',
            'No bowel restriction required and no military carcinomatosis at the mesenteric junction',
            'No obvious neoplastic involvement of the gastric wall',
            'No surface lesions'
        ]
    }
    validateResponse(responses) {
        //Makes sure that the responses are not altered and  are in the correcto format
        return Object.values(responses).every(response => typeof response === 'string' && this.twoCategory.includes(response) || this.zeroCategory.includes(response));
    }
    calculateScore(responses) {
        //calculates the score of teh responses
        let score = 0;
        Object.values(responses).forEach(response => {
            if(this.twoCategory.includes(response)) score += 2;
        });
        return score;
    }
    formulateRecommendation(score, responsesLength) {
        //makes a recommendation based on the score
        if(responsesLength === 7) {
            return score < 10 ? `Recommendation: Surgery` : `Recommendation: No surgery`;
        }
        return null;
    }
}
module.exports = new Fagotti();