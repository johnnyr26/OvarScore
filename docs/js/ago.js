"use strict";

var validate = function validate(category, response) {
  var categories = ['Disease-free interval > 6 months', 'Good Performance Status', 'No Residuals After Primary Surgery', 'No Or Small Volume Of Ascities'];
  var validCategory = categories.some(function (defaultCategory) {
    return category === defaultCategory || category === 'Peritoneal Carcinomatosis?';
  });
  var validValue = response === 'yes' || response === 'no';
  return validCategory && validValue;
};

var processResponse = function processResponse(category, response) {
  var categories = ['Disease-free interval > 6 months', 'Good Performance Status', 'No Residuals After Primary Surgery', 'No Or Small Volume Of Ascities'];
  var subCategories = ['', '(ECOG = 0)', '(If Unknown FIGO stage I/II Initially)', '(Less than < 500 mL)'];
  var recommendations = ['Surgery', 'No Surgery'];
  var nextResponse = '';
  var indexOfCategory = categories.indexOf(category);

  if (category === 'Disease-free interval > 6 months' && response === 'no') {
    // Don't return the object here because if the user decides to go back to the first question, the other questions don't go away if returned
    nextResponse = 'No Surgery';
  } else if (response === 'no') {
    if (category === 'Peritoneal Carcinomatosis?') return {
      response: '',
      recommendation: 'Recommendation: Surgery'
    };else nextResponse = 'Peritoneal Carcinomatosis?';
  } else {
    if (category === 'Peritoneal Carcinomatosis?') return {
      response: '',
      recommendation: "Recommendation: No Surgery"
    };else {
      var nextCategory = categories[indexOfCategory + 1];
      nextResponse = nextCategory ? nextCategory : 'Surgery';
    }
  }

  var subCategory = subCategories[categories.indexOf(nextResponse)];
  var categoryTitle = '';
  var subCategoryTitle = '';
  var checked = '';
  var noCheck = '';
  var htmlStructure = '';
  categories.find(function (categoryInArray, index) {
    if (index <= indexOfCategory) {
      categoryTitle = categoryInArray;
      subCategoryTitle = subCategories[index];
      checked = '';
      noCheck = '';

      if (index !== indexOfCategory || response === 'yes') {
        checked = 'checked';
        noCheck = '';
      } else {
        checked = '';
        noCheck = 'checked';
      }

      htmlStructure += "\n                <h1>".concat(categoryTitle, "</h1>\n                <h3>").concat(subCategoryTitle, "</h3>\n                <label>\n                    <input type='radio' name='").concat(categoryTitle, "' value='yes' ").concat(checked, "/>\n                    Yes\n                </label>\n                <label>\n                    <input type='radio' name='").concat(categoryTitle, "' value='no' ").concat(noCheck, "/>\n                    No\n                </label>\n                <hr>\n            ");
    }

    var noCategory = indexOfCategory === -1;

    if ((index === indexOfCategory || noCategory) && !recommendations.includes(nextResponse)) {
      categoryTitle = nextResponse;
      subCategoryTitle = subCategory || '';
      checked = '';
      noCheck = '';
      htmlStructure += "\n                <h1>".concat(categoryTitle, "</h1>\n                <h3>").concat(subCategoryTitle, "</h3>\n                <label>\n                    <input type='radio' name='").concat(categoryTitle, "' value='yes' ").concat(checked, "/>\n                    Yes\n                </label>\n                <label>\n                    <input type='radio' name='").concat(categoryTitle, "' value='no' ").concat(noCheck, "/>\n                    No\n                </label>\n                <hr>\n            ");
    }

    return categoryInArray === category;
  });
  var output = {
    response: htmlStructure
  };

  if (recommendations.includes(nextResponse)) {
    output.recommendation = 'Recommendation: ' + nextResponse;
  }

  return output;
};

var addClickListener = function addClickListener() {
  Object.values(document.getElementsByTagName('input')).forEach(function (radio) {
    return radio.addEventListener('click', function () {
      return postData(radio);
    });
  });
};

var postData = function postData(radio) {
  var category = radio.name,
      value = radio.value;
      
  if (!validate(category, value)) {
    return document.getElementById('recommendation').innerHTML = 'Error: There was an error processing the response.';
  } else {
    var response = processResponse(category, value);
    if (response.response) document.getElementById('categories').innerHTML = response.response;
    document.getElementById('recommendation').textContent = response.recommendation || '';
    smoothScrollToDiv('categories');
    addClickListener();
  }
};

function smoothScrollToDiv(id) {
  var div = document.getElementById(id);
  $('html, body').animate({ 
    scrollTop: $(div).offset().top + $(div).outerHeight(true)
  }, 700);
}

window.onload = addClickListener();