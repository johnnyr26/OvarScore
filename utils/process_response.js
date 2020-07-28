const processAgoResponse = (category, response) => {
    const categories = [
        'Disease-free interval > 6 months',
        'Good Performance Status', 
        'No Residuals After Primary Surgery',
        'No Or Small Volume Of Ascities'
    ];
    const subCategories = [
        '',
        '(ECOG = 0)',
        '(If Unknown FIGO stage I/II Initially)',
        '(Less than < 500 mL)'
    ];
    const recommendations = ['Surgery', 'No Surgery'];
    let nextResponse = '';
    const indexOfCategory = categories.indexOf(category);
    if (category === 'Disease-free interval > 6 months' && response === 'no') {
        // Don't return the object here because if the user decides to go back to the first question, the other questions don't go away if returned
        nextResponse = 'No Surgery';
    } else if (response === 'no') {
        if (category === 'Peritoneal Carcinomatosis?') return { response: '', recommendation: 'Recommendation: Surgery' };
        else nextResponse = 'Peritoneal Carcinomatosis?';
    } else {
        if (category === 'Peritoneal Carcinomatosis?') return { response: '', recommendation: `Recommendation: No Surgery` };
        else {
            const nextCategory = categories[indexOfCategory + 1];
            nextResponse = nextCategory ? nextCategory : 'Surgery';
        }
    }
    const subCategory = subCategories[categories.indexOf(nextResponse)];
    let categoryTitle = '';
    let subCategoryTitle = '';
    let checked = '';
    let noCheck = '';
    let htmlStructure = '';
    categories.find((categoryInArray, index) => {
        if (index <= indexOfCategory) {
            categoryTitle = categoryInArray;
            subCategoryTitle  = subCategories[index];
            checked = '';
            noCheck = '';
            if (index !== indexOfCategory || response === 'yes') {
                checked = 'checked';
                noCheck = '';
            } else {
                checked = '';
                noCheck = 'checked';
            }
            htmlStructure += `
                <h1>${categoryTitle}</h1>
                <h3>${subCategoryTitle}</h3>
                <label>
                    <input type='radio' name='${categoryTitle}' value='yes' ${checked}/>
                    Yes
                </label>
                <label>
                    <input type='radio' name='${categoryTitle}' value='no' ${noCheck}/>
                    No
                </label>
                <hr>
            `;
        }
        const noCategory = indexOfCategory === -1;
        if ((index === indexOfCategory || noCategory) && !recommendations.includes(nextResponse)) {
            categoryTitle = nextResponse;
            subCategoryTitle = subCategory || '';
            checked = '';
            noCheck = '';
            htmlStructure += `
                <h1>${categoryTitle}</h1>
                <h3>${subCategoryTitle}</h3>
                <label>
                    <input type='radio' name='${categoryTitle}' value='yes' ${checked}/>
                    Yes
                </label>
                <label>
                    <input type='radio' name='${categoryTitle}' value='no' ${noCheck}/>
                    No
                </label>
                <hr>
            `;
        }
        return categoryInArray === category;
    });
    const output = { response: htmlStructure }
    if (recommendations.includes(nextResponse)) {
        output.recommendation = 'Recommendation: ' + nextResponse;
    }
    return output;
}
const processIModelResponses = (responses) => {
    let score = 0;
    const categoryScores = [
        {response: responses['FIGO'], options: ['III','IV'], score: 0.8},
        {response: responses['RD'], options: ['>0'], score: 1.5},
        {response: responses['PFI'], options: ['<16'], score: 2.4},
        {response: responses['ECOG'], options: ['2-3'], score: 2.4},
        {response: responses['CA125'], options: ['>105'], score: 1.8},
        {response: responses['ASCITES'], options: ['Present'], score: 3}
    ];
    categoryScores.forEach(category => {
        if (category['options'].includes(category['response'])) score += category['score'];
    });
    let recommendation = '';
    const everyCategoryFilled = Object.values(responses).length === 6;
    if (everyCategoryFilled) recommendation = score <= 4.7 ? `Recommendation: Surgery` : `Recommendation: No surgery`;
    return { score: score.toFixed(1), recommendation };
}
const processFagottiResponses = (responses) => {
    const twoCategory = [
        'Unresectable massive peritoneal involvement plus miliary pattern of distribution',
        'Widespread infiltrating carcinomatosis or confluent nodules to most of the diaphragmatic surface',
        'Large infiltrating nodules or involvement of the root of the mesentery assumed based on limited movements of various intestinal segments',
        'Tumour diffusion up to the large curvature of the stomach',
        'Bowel resection assumed to be required or military carcinomatosis at the mesentric junction',
        'Obvious neoplasyic involvement of the gastric wall',
        'Any surface lesions'
    ];
    let score = 0;
    Object.values(responses).forEach(response => {
        if (twoCategory.includes(response)) score += 2;
    });
    let recommendation = '';
    const everyCategoryFilled = Object.values(responses).length === 7;
    if (everyCategoryFilled) recommendation = score <= 10 ? 'Recommendation: Surgery' : 'Recommendation: No Surgery';
    return { score, recommendation };
}
module.exports = {
    ago: processAgoResponse,
    iModel: processIModelResponses,
    fagotti: processFagottiResponses
}