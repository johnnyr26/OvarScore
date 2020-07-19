window.onload = postData();
function postData(radio) {
    if(!radio) {
        var htmlResponse = [
                '<h1>Disease-free interval > 6 months</h1>',
                "<input type='radio' id='0' name='Disease-free interval > 6 months' onclick='postData(this)' value='yes'/>",
                "<label for='yes'> Yes</label>",
                "<input type='radio' id='1' name='Disease-free interval > 6 months' onclick='postData(this)' value='no'/>",
                "<label for='no'> No</label>",
                "<hr>"
        ];
        for(var i=0; i<htmlResponse.length; i++) {
            document.getElementById('categories').innerHTML += htmlResponse[i];
        }
        return;
    }
    fetch('/ago', {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: 'category=' + radio.name + '&response=' + radio.value
    }).then(response => response.json())
    .then(response => {
        if(response.error) throw response.error;
        if(response.response) document.getElementById('categories').innerHTML = response.response;
        document.getElementById('recommendation').textContent = response.recommendation || '';
    }).catch(error => {
        document.getElementById('recommendation').innerHTML = 'Error: ' + error;
    });
}