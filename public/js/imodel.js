function postData(radio) {
    var radios = document.getElementsByTagName('input');
    var url = '';
    for(var element of radios) {
        if(element.checked) url += element.name + '=' + element.value + '&';
    }
    fetch('/imodel', {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: url.slice(0, -1)
    }).then(response => response.json())
    .then(response => {
        if(response.error) throw response.error;
        document.getElementById('recommendation').textContent = response.recommendation;
        document.getElementById('score').textContent = 'Score: ' + response.score;
    }).catch(error => {
        document.getElementById('recommendation').textContent = 'Error: ' + error;
        document.getElementById('score').textContent = '';
    })
}