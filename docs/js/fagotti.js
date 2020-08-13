"use strict";

var validate = function validate(responses) {
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
};

var processResponse = function processResponse(responses) {
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
      recommendation: 'Recommendation: No surgery'
    }
  }
  var everyCategoryFilled = Object.values(responses).length === 7;
  if (everyCategoryFilled) recommendation = score <= 10 ? 'Recommendation: Surgery' : 'Recommendation: No Surgery';
  return {
    score: score,
    recommendation: recommendation
  };
};

Object.values(document.getElementsByTagName('td')).forEach(function (cell) {
  cell.addEventListener('click', function () {
    var classCells = document.getElementsByClassName(cell.className);
    Object.values(classCells).forEach(function (classCell) {
      return classCell.removeAttribute('style');
    });
    var color = 'rgba(0, 128, 128, 0.3)';
    cell.style.backgroundColor = color;
    var input = {};
    var rowCells = Object.values(document.getElementsByTagName('td')).filter(function (cell) {
      return cell.className.includes('row');
    });
    rowCells.forEach(function (cell, index) {
      if (cell.style.backgroundColor === color) {
        input['row' + Math.floor(index / 2)] = cell.textContent;
      }
    });
    if (!validate(input)) {
      document.getElementById('recommendation').textContent = 'Error: There was an error processing the response.';
      document.getElementById('score').textContent = '';
    } else {
      var response = processResponse(input);
      document.getElementById('recommendation').textContent = response.recommendation;
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