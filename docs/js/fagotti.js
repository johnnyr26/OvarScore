"use strict";

var validate = function validate(step, responses) {
  if (step === 1) {
    var categories = ['retraction', 'serosa', 'junction', 'bowel'];
    var validatedKeys = Object.keys(responses).every(key => categories.includes(key));
    var validatedValues = Object.values(responses).every(value => value === 'Yes' || value === 'No');
    return validatedKeys && validatedValues;
  } else {
    var twoCategory = [
      'Unresectable massive peritoneal involvement plus miliary pattern of distribution', 
      'Widespread infiltrating carcinomatosis or confluent nodules to most of the diaphragmatic surface', 
      'Large infiltrating nodules or involvement of the root of the mesentery assumed based on limited movements of various intestinal segments', 
      'Tumour diffusion up to the large curvature of the stomach', 
      'Possible large/small bowel resection (excluding, recto-sigmoid involvement) assumed to be required or miliary carcinomatosis at mesenteric junction', 
      'Obvious neoplastic involvement of the stomach, and/or lesser omentum, and/or spleen',
      'Any nodules >2 cm'
    ];
    var zeroCategory = [
      'Carcinomatosis involving a limited area surgically removable by peritonectomy', 
      'Isolated diaphragmatic disease', 
      'Small nodules potentially treatable with argon-beam coagulation', 
      'Isolated omental disease', 
      'No bowel resection required and no miliary carcinomatosis at the mesenteric junction', 
      'No obvious neoplastic involvement of the stomach, and/or lesser omentum, and/or spleen', 
      'No nodules >2 cm'
    ];
    var correctValues = Object.values(responses).every(function (response) {
      return !response || twoCategory.includes(response) || zeroCategory.includes(response);
    });
    return correctValues;
  }
};

var processResponse = function processResponse(step, responses) {
  if (step === 1) {
    return Object.values(responses).every(response => response === 'Yes');
  } else {
    var twoCategory = [
      'Unresectable massive peritoneal involvement plus miliary pattern of distribution', 
      'Widespread infiltrating carcinomatosis or confluent nodules to most of the diaphragmatic surface', 
      'Large infiltrating nodules or involvement of the root of the mesentery assumed based on limited movements of various intestinal segments', 
      'Tumour diffusion up to the large curvature of the stomach', 
      'Possible large/small bowel resection (excluding, recto-sigmoid involvement) assumed to be required or miliary carcinomatosis at mesenteric junction', 
      'Obvious neoplastic involvement of the stomach, and/or lesser omentum, and/or spleen',
      'Any nodules >2 cm'
    ];
    var score = 0;
    var recommendation = '';
    var automaticNoSurgery = false;
    Object.values(responses).forEach(function (response) {
      if (response === 'Large infiltrating nodules or involvement of the root of the mesentery assumed based on limited movements of various intestinal segments') {
        automaticNoSurgery = true;
      }
      if (twoCategory.includes(response)) score += 2;
    });
    if (automaticNoSurgery) {
      return {
        score: null,
        recommendation: 'Recommendation: No Surgery'
      }
    }
    var everyCategoryFilled = Object.values(responses).length === 7;
    if (everyCategoryFilled) recommendation = score <= 10 ? 'Recommendation: Surgery' : 'Recommendation: No Surgery';
    return {
      score: score,
      recommendation: recommendation
    };
  }
};
Object.values(document.querySelectorAll('input[type="radio"]')).forEach(function (element) {
  element.addEventListener('click', function  () {
    var radios = document.querySelectorAll('input[type="radio"]');
    var input = {};
    radios.forEach(radio => {
      if (radio.checked) {
        input[radio.name] = radio.value;
      }
    })
    if (!validate(1, input)) {
      document.getElementById('recommendationFirst').textContent = 'Error: There was an error processing the response.';
      document.getElementById('fagotti-main-div').style.display = 'none';
      return window.scroll({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
    document.getElementById('recommendationFirst').textContent = '';
    if (Object.values(input).some(response => response !== 'Yes')) {
      document.getElementById('recommendationFirst').textContent = 'Recommendation: No Surgery';
      document.getElementById('fagotti-main-div').style.display = 'none';
      return window.scroll({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    } else if (Object.entries(input).length === 4 && processResponse(1, Object.values(input))) {
      document.getElementById('fagotti-main-div').style.display = 'block';
      document.getElementById("fagotti-main-div").scrollIntoView({behavior: 'smooth'});
    }
  });
});
Object.values(document.getElementsByTagName('td')).forEach(function (cell) {
  cell.addEventListener('click', function () {
    var classCells = document.getElementsByClassName(cell.className);
    Object.values(classCells).forEach(function (classCell) {
      return classCell.removeAttribute('style');
    });
    var color = 'rgba(0, 128, 128, 0.3)';
    cell.style.backgroundColor = color;
    var input = {};
    var rowCells = Object.values(document.getElementsByTagName('td')).filter(function (tdCell) {
      return tdCell.className.includes('row');
    });
    rowCells.forEach(function (rowCell, index) {
      if (rowCell.style.backgroundColor === color) {
        input['row' + Math.floor(index / 2)] = rowCell.textContent;
      }
    });
    if (!validate(2, input)) {
      document.getElementById('recommendationSecond').textContent = 'Error: There was an error processing the response.';
      document.getElementById('score').textContent = '';
    } else {
      var response = processResponse(2, input);
      document.getElementById('recommendationSecond').textContent = response.recommendation;
      // Null since 0 is considered a falsey value
      if (response.score !== null) {
        document.getElementById('score').textContent = 'Score: ' + response.score;
      } else {
        document.getElementById('score').textContent = '';
      }
      if (response.recommendation) {
        window.scroll({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  });
});