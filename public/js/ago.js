window.onload = postData();
function postData(radio) {
    if(!radio) {
        var htmlResponse = [
                "<h1>Disease-free interval > 6 months</h1>",
                "<input type='radio' id='0' name='Disease-free interval > 6 months' onclick='postData(this)' value='yes'/>",
                "<label for='yes'>Yes</label>",
                "<input type='radio' id='1' name='Disease-free interval > 6 months' onclick='postData(this)' value='no'/>",
                "<label for='no'>No</label>",
                "<hr>"
        ];
        for(var element of htmlResponse) {
            document.getElementById('categories').innerHTML += element;
        }
        return;
    }
    var htmlElements = [];
    var htmlDiv = document.getElementsByTagName('*')[8].childNodes
    //Beause I'm always clearing up and then inserting the elements, I have to set the check attribute
    for(var element of document.getElementsByName(radio.name)) {
        element.removeAttribute('checked');
    }
    radio.setAttribute('checked', true);
    var checkedElements = [];
    var lastRadioChecked = false;
    for(var element of htmlDiv) {
        if(element.nodeName !== '#text') {
            htmlElements.push(element);
            if(element.tagName === 'INPUT' && element.checked && !lastRadioChecked) {
                checkedElements.push({
                    category: element.name,
                    value: element.value
                });
                if(element === radio) lastRadioChecked = true;
            }
        }
    }
    var body = '';
    for(var element of checkedElements) {
        body += element.category + '=' + element.value + '&';
    }
    fetch('/ago', {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: body.slice(0, -1)
    }).then(response => response.json())
    .then(response => {
        if(response.error) throw response.error;
        //Basically this is pretty bad coding but I'm clearing up the page and then inserting the elements back in based on the user's input
        for(var i=0; i < htmlDiv.length; i ++) {
            if(htmlDiv[i] === radio) {
                htmlElements = radio.value === 'yes' ? htmlElements.slice(0, i+5) : htmlElements.slice(0, i+3);
            }
        }
        document.getElementById('categories').innerHTML = null;
        for(var element of htmlElements) {
            document.getElementById('categories').appendChild(element);
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
        for(var element of htmlResponse) {
            document.getElementById('categories').innerHTML += element;
        }
    }).catch(error => {
        document.getElementById('recommendation').innerHTML = 'Error: ' + error;
    });
}