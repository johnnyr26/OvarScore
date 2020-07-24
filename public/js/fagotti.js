Object.values(document.getElementsByTagName('td')).forEach(function(cell) { 
    cell.addEventListener('click', function() {
        var classCells = document.getElementsByClassName(cell.className);
        Object.values(classCells).forEach(function(classCell) {
            classCell.removeAttribute('style');
        });
        var color = 'rgba(0, 128, 128, 0.3)';
        cell.style.backgroundColor = color;
        var body = '';
        var rowCells = Object.values(document.getElementsByTagName('td')).filter(function(cell) { return cell.className.includes('row') });
        rowCells.forEach(function(cell, index) {
            if(cell.style.backgroundColor === color) {
                body += 'row' + Math.floor(index/2) + '=' + cell.textContent + '&';
            }
        });
        fetch('/fagotti', {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body
        }).then(function(response) { return response.json() })
        .then(function(response) {
            if (response.error) throw response.error;
            document.getElementById('recommendation').textContent = response.recommendation;
            document.getElementById('score').textContent = 'Score: ' + response.score;
        }).catch(function(error)  {
            document.getElementById('recommendation').textContent = error;
            document.getElementById('score').textContent = '';
        });
    }); 
});