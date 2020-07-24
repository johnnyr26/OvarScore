function postData(radio) {
    fetch('/ago', {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: 'category=' + radio.name + '&response=' + radio.value
    }).then(function(response) { return response.json() })
    .then(function(response) {
        if (response.error) throw response.error;
        if (response.response) document.getElementById('categories').innerHTML = response.response;
        document.getElementById('recommendation').textContent = response.recommendation || '';
    }).catch(function(error) {
        document.getElementById('recommendation').innerHTML = error;
    });
}