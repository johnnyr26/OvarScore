Object.values(document.getElementsByTagName('td')).forEach(cell => { 
    cell.addEventListener('click', () => {
        const classCells = document.getElementsByClassName(cell.className);
        Object.values(classCells).forEach(classCell => classCell.removeAttribute('style'));
        const color = 'rgba(0, 128, 128, 0.3)';
        cell.style.backgroundColor = color;
        let response = {};
        const rowCells = Object.values(document.getElementsByTagName('td')).filter(cell => cell.className.includes('row'));
        rowCells.forEach((cell, index) => {
            if (cell.style.backgroundColor === color) {
                response['row' + Math.floor(index/2)] = cell.textContent;
            }
        });
        fetch('/fagotti', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(response)
        }).then(response => response.json())
        .then(response => {
            if (response.error) throw response.error;
            document.getElementById('recommendation').textContent = response.recommendation;
            document.getElementById('score').textContent = 'Score: ' + response.score;
            if (response.recommendation) {
                window.scroll({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }).catch(error => {
            document.getElementById('recommendation').textContent = error;
            document.getElementById('score').textContent = '';
        });
    }); 
});