window.onload = postData();
function postData(radio) {
    if(!radio) {
        var htmlResponse = [
                '<h1>Disease-free interval > 6 months</h1>',
                "<input type='radio' id='0' name='Disease-free interval > 6 months' onclick='postData(this)' value='yes'/>",
                "<label for='yes'>Yes</label>",
                "<input type='radio' id='1' name='Disease-free interval > 6 months' onclick='postData(this)' value='no'/>",
                "<label for='no'>No</label>",
                "<hr>"
        ];
        for(var i=0; i<htmlResponse.length; i++) {
            document.getElementById('categories').innerHTML += htmlResponse[i];
        }
        return;
    }
    var htmlElements = [];
    var htmlDiv = document.getElementsByTagName('*')[9].childNodes
    for(var i=0; i<document.getElementsByName(radio.name).length; i++) {
        document.getElementsByName(radio.name)[i].removeAttribute('checked');
    }
    radio.setAttribute('checked', true);
    for(var i=0; i<htmlDiv.length; i++) {
        if(htmlDiv[i].nodeName !== '#text') {
            htmlElements.push(htmlDiv[i]);
        }
    }
    const body = 'category=' + radio.name + '&value=' + radio.value;
    fetch('/ago', {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body
    }).then(response => response.json())
    .then(response => {
        if(response.error) throw response.error;
        for(var i=0; i<htmlDiv.length; i++) {
                if(htmlDiv[i] === radio) {
                    if(radio.value === 'yes') htmlElements = htmlElements.slice(0, i+5);
                    else htmlElements = htmlElements.slice(0, i+3);
                }
            }
            document.getElementById('categories').innerHTML = null;
            for(var i=0; i<htmlElements.length; i++) {
                document.getElementById('categories').appendChild(htmlElements[i]);
            }
            if(response.recommendation) {
                return document.getElementById('recommendation').innerHTML = 'Recommendation: ' + response.recommendation;
            } else {
                document.getElementById('recommendation').innerHTML = null;
            }
            var htmlResponse = [
                "<h1>" + response.category + '</h1>',
                "<h3>" + response.subCategory + '</h3>',
                "<input type='radio' name='" + response.category + "' onclick='postData(this)' value='yes'/>",
                "<label for='yes'>Yes</label>",
                "<input type='radio' name='" + response.category + "' onclick='postData(this)' value='no'/>",
                "<label for='no'>No</label>",
                "<hr>"
            ];
            for(var i=0; i<htmlResponse.length; i++) {
                document.getElementById('categories').innerHTML += htmlResponse[i];
            }
    }).catch(error => {
        document.getElementById('recommendation').innerHTML = 'Error: ' + error;
    });
}