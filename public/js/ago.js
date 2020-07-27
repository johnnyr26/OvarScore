const postData = radio => {
    const response = { category: radio.name, response: radio.value };
    fetch('/ago', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(response)
    }).then(response => response.json())
    .then(response => {
        if (response.error) throw response.error;
        if (response.response) document.getElementById('categories').innerHTML = response.response;
        document.getElementById('recommendation').textContent = response.recommendation || '';
        addClickListener();
    }).catch(error => {
        document.getElementById('recommendation').innerHTML = error;
    });
}
const addClickListener = () => {
    Object.values(document.getElementsByTagName('input')).forEach(radio => radio.addEventListener('click', () => postData(radio)));
}
addClickListener();