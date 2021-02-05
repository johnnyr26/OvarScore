"use strict";

var validate = function validate(responses) {
  var options = {
    FIGO: ['I', 'II', 'III', 'IV'],
    RD: ['0', '>0'],
    PFI: ['<16', '≥16'],
    ECOG: ['0-1', '2-3'],
    CA125: ['>105', '≤105'],
    ASCITES: ['Present', 'Absent']
  };
  var properKeys = Object.keys(responses).every(function (key) {
    return options[key];
  });
  return properKeys ? Object.keys(responses).every(function (key) {
    return !responses[key] || options[key].includes(responses[key]);
  }) : false;
};

var processResponses = function processResponses(responses) {
  var score = 0;
  var categoryScores = [{
    response: responses['FIGO'],
    options: ['III', 'IV'],
    score: 0.8
  }, {
    response: responses['RD'],
    options: ['>0'],
    score: 1.5
  }, {
    response: responses['PFI'],
    options: ['<16'],
    score: 2.4
  }, {
    response: responses['ECOG'],
    options: ['2-3'],
    score: 2.4
  }, {
    response: responses['CA125'],
    options: ['>105'],
    score: 1.8
  }, {
    response: responses['ASCITES'],
    options: ['Present'],
    score: 3
  }];
  categoryScores.forEach(function (category) {
    if (category['options'].includes(category['response'])) score += category['score'];
  });
  var recommendation = '';
  var everyCategoryFilled = Object.values(responses).length === 6;
  if (everyCategoryFilled) recommendation = score <= 4.7 ? "Recommendation: Surgery" : "Recommendation: No Surgery";
  return {
    score: score.toFixed(1),
    recommendation: recommendation
  };
};

Object.values(document.getElementsByTagName('input')).forEach(function (radio) {
  radio.addEventListener('click', function () {
    var radios = document.getElementsByTagName('input');
    var input = {};
    Object.values(radios).forEach(function (element) {
      if (element.checked) input[element.name] = element.value;
    });

    if (!validate(input)) {
      document.getElementById('recommendation').textContent = 'Error: There was an error processing the response.';
      document.getElementById('score').textContent = '';
    } else {
      var response = processResponses(input);
      document.getElementById('recommendation').textContent = response.recommendation;
      document.getElementById('score').textContent = 'Score: ' + response.score;
      if (response.recommendation) {
        smoothScrollToDiv('score');
      }
    }
  });
});

function smoothScrollToDiv(id) {
  var div = document.getElementById(id);
  $('html, body').animate({ 
    scrollTop: $(document).height()-$(div).height()}, 
    800);
}