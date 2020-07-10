class Fagotti {
    constructor() {
        this.twoCategory = [
            'Unresectable massive peritoneal involvement plus miliary pattern of distribution',
            'Widespread infiltrating carcinomatosis or confluent nodules to most of the diaphragmatic surface',
            'Large infiltrating nodules or involvement of the root of the mesentery assumed based on limited movements of various intestinal segments',
            'Tumour diffusion up to the large curvature of the stomach',
            'Bowel resection assumed to be required or military carcinomatosis at the mesentric junction',
            'Obvious neoplasyic involvement of the gastric wall',
            'Any surface lesions'
        ];
    }
    calculateScore(responses) {
        let score = 0;
        Object.values(responses).forEach(response => {
            if(this.twoCategory.includes(response)) score += 2;
        });
        return score;
    }
    formulateRecommendation(score, responsesLength) {
        if(responsesLength === 7) {
            return score < 10 ? `Recommendation: Surgery` : `Recommendation: No surgery`;
        }
        return null;
    }
}
module.exports = new Fagotti();