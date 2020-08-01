'use strict';

Object.values(document.getElementsByTagName('input')).forEach(function (radio) {
    radio.addEventListener('click', function () {
        var radios = document.getElementsByTagName('input');
        var response = {};
        Object.values(radios).forEach(function (element) {
            if (element.checked) response[element.name] = element.value;
        });
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/imodel', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                var response = JSON.parse(this.responseText);
                document.getElementById('recommendation').textContent = response.recommendation;
                document.getElementById('score').textContent = 'Score: ' + response.score;
                if (response.recommendation) {
                    window.scroll({
                        top: document.body.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            } else {
                var response = JSON.parse(this.responseText);
                document.getElementById('recommendation').textContent = response.error;
                return document.getElementById('score').textContent = '';
            }
        }
        xhr.send(JSON.stringify(response));
        
    });
});