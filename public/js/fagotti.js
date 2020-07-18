function processClick(cell) {
    var classCells = document.getElementsByClassName(cell.className);
    for(var classCell of classCells) {
        classCell.removeAttribute('style');
    }
    const color = 'rgba(0, 128, 128, 0.3)';
    cell.style.backgroundColor = color;
    var body = '';
    for(var i=0; i<=6; i++) {
        var options = document.getElementsByClassName('row' + i);
        if(options[0].style.backgroundColor === color) {
            body += 'row' + i + '=' + options[0].textContent + '&';
        } else if(options[1].style.backgroundColor === color) {
            body += 'row' + i + '=' + options[1].textContent + '&';
        }
    }
    body = body.slice(0, -1);
    fetch('/fagotti', {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body
    }).then(response => response.json())
    .then(response => {
        if(response.error) throw response.error;
        document.getElementById('recommendation').textContent = response.recommendation;
        document.getElementById('score').textContent = 'Score: ' + response.score;
    }).catch(error => {
        document.getElementById('recommendation').textContent = 'Error: ' + error;
        document.getElementById('score').textContent = '';
    });
}