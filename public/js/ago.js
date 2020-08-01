'use strict';

var postData = function postData(radio) {
    var response = { category: radio.name, response: radio.value };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/ago', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            var response = JSON.parse(this.responseText);
            if (response.response) document.getElementById('categories').innerHTML = response.response;
            document.getElementById('recommendation').textContent = response.recommendation || '';
            addClickListener();
            window.scroll({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        } else {
            var response = JSON.parse(this.responseText);
            return document.getElementById('recommendation').innerHTML = response.error;
        }
    }
    xhr.send(JSON.stringify(response));
};
var addClickListener = function addClickListener() {
    Object.values(document.getElementsByTagName('input')).forEach(function (radio) {
        return radio.addEventListener('click', function () {
            return postData(radio);
        });
    });
};
addClickListener();