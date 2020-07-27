const validateAgo = (category, response) => {
    const categories = [
        'Disease-free interval > 6 months',
        'Good Performance Status', 
        'No Residuals After Primary Surgery',
        'No Or Small Volume Of Ascities'
    ];
    const validCategory = categories.some(defaultCategory => category === defaultCategory|| category === 'Peritoneal Carcinomatosis?');
    const validValue = response === 'yes' || response === 'no';
    return validCategory && validValue;
}
const validateIModel = responses => {
    const options = {
        FIGO: ['I', 'II', 'III', 'IV'], 
        RD: ['0', '>0'],  
        PFI: ['<16', '≥16'], 
        ECOG: ['0-1', '2-3'],
        CA125: ['>105', '≤105'],
        ASCITES: ['Present', 'Absent']
    };
    const properKeys = Object.keys(responses).every(key => options[key]);
    return properKeys ? Object.keys(responses).every(key => !responses[key] || options[key].includes(responses[key])) :false;
}
const vaildateFagotti = responses => {
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
    return correctValues;
}
module.exports =  {
    ago: validateAgo,
    iModel: validateIModel,
    fagotti: vaildateFagotti
}