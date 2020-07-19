class AGO {
    constructor() {
        this.categories = [
            'Disease-free interval > 6 months',
            'Good Performance Status', 
            'No Residuals After Primary Surgery',
            'No Or Small Volume Of Ascities'
        ];
        this.subCategories = [
            '',
            '(ECOG = 0)',
            '(If Unknown FIGO stage I/II Initially)',
            '(Less than < 500 mL)'
        ]
        this.noCategory = 'Peritoneal Carcinomatosis?';
        this.recommendations = ['Surgery', 'No Surgery'];
    }
    processNextResponse(category, response) {
        let nextResponse = '';
        if(category === this.categories[0] && response === 'no') {
            nextResponse = this.recommendations[1];
        } else if(response === 'no') {
            if(category === this.noCategory) return { response: '', recommendation: `Recommendation: ${this.recommendations[0]}` };
            else nextResponse = this.noCategory;
        } else {
            if(category === this.noCategory) return { response: '', recommendation: `Recommendation: ${this.recommendations[1]}` };
            else {
                const indexOfKey = this.categories.indexOf(category);
                const nextCategory = this.categories[indexOfKey + 1];
                if(nextCategory) nextResponse = nextCategory;
                else nextResponse = this.recommendations[0];
            }
        }
        const subCategory = this.subCategories[this.categories.findIndex(category => category === nextResponse)];
        const htmlStructure = [
            '<h1>{{category}}</h1>',
            '<h3>{{subCategory}}</h3>',
            "<input type='radio' name='{{category}}' onclick='postData(this)' value='yes' {{checked}}/>",
            "<label for='yes'> Yes</label>",
            "<input type='radio' name='{{category}}' onclick='postData(this)' value='no' {{noCheck}}/>",
            "<label for='no' > No</label>",
            "<hr>"
        ];
        const categoryIndex = this.categories.indexOf(category);
        let htmlOutput = '';
        this.categories.find((categoryInArray, index) => {
            if (index <= categoryIndex) {
                htmlStructure.forEach(html => {
                    html = html.replace('{{category}}', categoryInArray);
                    html = html.replace('{{subCategory}}', this.subCategories[index]);
                    if(index !== categoryIndex || response === 'yes') {
                        html = html.replace('{{checked}}', 'checked');
                    } else {
                        html = html.replace('{{noCheck}}', 'checked');
                    }
                    htmlOutput += html
                })
            }
            const noCategory = categoryIndex === -1;
            if ((index === categoryIndex || noCategory) && !this.recommendations.includes(nextResponse)) {
                htmlStructure.forEach(html => {
                    html = html.replace('{{category}}', nextResponse);
                    html = html.replace('{{subCategory}}', subCategory || '');
                    html = html.replace('{{checked}}', '');
                    html = html.replace('{{noCheck}}', '');
                    htmlOutput += html
                });
            }
            return categoryInArray === category;
        });
        const output = { response: htmlOutput }
        if(this.recommendations.includes(nextResponse)) {
            output.recommendation = 'Recommendation: ' + nextResponse;
        }
        return output;
    }
    validateResponse(response) {
        const validCategory = this.categories.some(category => category === response.category || response.category === this.noCategory);
        const validValue = response.response === 'yes' || response.response === 'no';
        return validCategory && validValue;
    }
}
module.exports = new AGO();