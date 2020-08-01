'use strict';

Object.values(document.getElementsByTagName('td')).forEach(function (cell) {
    cell.addEventListener('click', function () {
        var classCells = document.getElementsByClassName(cell.className);
        Object.values(classCells).forEach(function (classCell) {
            return classCell.removeAttribute('style');
        });
        var color = 'rgba(0, 128, 128, 0.3)';
        cell.style.backgroundColor = color;
        var response = {};
        var rowCells = Object.values(document.getElementsByTagName('td')).filter(function (cell) {
            return cell.className.includes('row');
        });
        rowCells.forEach(function (cell, index) {
            if (cell.style.backgroundColor === color) {
                response['row' + Math.floor(index / 2)] = cell.textContent;
            }
        });
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/fagotti', true);
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