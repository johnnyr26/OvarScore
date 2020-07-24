const validateAgo = (category, response) => {
    return new Promise((resolve, reject) => {
        const categories = [
            'Disease-free interval > 6 months',
            'Good Performance Status', 
            'No Residuals After Primary Surgery',
            'No Or Small Volume Of Ascities'
        ];
        const validCategory = categories.some(defaultCategory => category === defaultCategory|| category === 'Peritoneal Carcinomatosis?');
        const validValue = response === 'yes' || response === 'no';
        if (validCategory && validValue) resolve();
        reject('Error: There was an error processing the response.');
    });
}
const validateIModel = responses => {
    return new Promise((resolve, reject) => {
        const options = {
            FIGO: ['I', 'II', 'III', 'IV'], 
            RD: ['0', '>0'],  
            PFI: ['<16', '≥16'], 
            ECOG: ['0-1', '2-3'],
            CA125: ['>105', '≤105'],
            ASCITES: ['Present', 'Absent']
        };
        const properKeys = Object.keys(responses).every(key => options[key]);
        const properValues = Object.keys(responses).every(key => !responses[key] || options[key].includes(responses[key]));
        if (properKeys && properValues) resolve();
        reject('Error: There was an error processing the response.');
    });
}
const vaildateFagotti = responses => {
    return new Promise((resolve, reject) => {
        const twoCategory = [
            'Unresectable massive peritoneal involvement plus miliary pattern of distribution',
            'Widespread infiltrating carcinomatosis or confluent nodules to most of the diaphragmatic surface',
            'Large infiltrating nodules or involvement of the root of the mesentery assumed based on limited movements of various intestinal segments',
            'Tumour diffusion up to the large curvature of the stomach',
            'Bowel resection assumed to be required or military carcinomatosis at the mesentric junction',
            'Obvious neoplasyic involvement of the gastric wall',
            'Any surface lesions'
        ];
        const zeroCategory = [
            'Carcinomatosis involving a limited area surgically removable by peritonectomy',
            'Isolated diaphragmatic disease',
            'Small nodules potentially treatable with argon-beam coagulation',
            'Isolated omental disease',
            'No bowel restriction required and no military carcinomatosis at the mesenteric junction',
            'No obvious neoplastic involvement of the gastric wall',
            'No surface lesions'
        ];
        const correctValues = Object.values(responses).every(response => {
            return !response || twoCategory.includes(response) || zeroCategory.includes(response);
        });
        if (correctValues) resolve();
        reject('Error: There was an error processing the response.');
    });
}
module.exports =  {
    ago: validateAgo,
    iModel: validateIModel,
    fagotti: vaildateFagotti
}