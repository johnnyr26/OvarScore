Object.values(document.getElementsByTagName('input')).forEach(radio => {
    radio.addEventListener('click', () => {
        const radios = document.getElementsByTagName('input');
        let response = {};
        Object.values(radios).forEach(element => {
            if (element.checked) response[element.name] = element.value;
        });
        fetch('/imodel', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
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