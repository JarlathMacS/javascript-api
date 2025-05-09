const API_KEY = '7BbI9s7vhAZMAYaWsO1UeYjvrrs';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', (e) => getStatus(e));
document.getElementById('submit').addEventListener('click', (e) => postForm(e));

function processOptions(form) {
    let optArray = [];

    for (const element of form.entries()) {
        if (element[0] === 'options') {
            optArray.push(element[1]);
        }
    }
    form.delete('options');
    form.append('options', optArray.join());

    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById('checksform')));

    // for (const element of form.entries()) {
    //     console.log(element);
    // }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            Authorization: API_KEY,
        },
        body: form,
    });

    const data = await response.json();

    if (response.ok) {
        // console.log(data);
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }

    // for (const element of form.entries()) {
    //     console.log(element);
    // }
}

function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;
    let results;

    if (data.total_errors === 0) {
        results = `<div class='no-errors'>No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class='error-count'>${data.total_errors}</span></div>`;

        for (const error of data.error_list) {
            results += `<div>At line <span class='line'>${error.line}</span>, `;
            results += `column <span class='column'>${error.col}</span></div>`;
            results += `<div class='error'>${error.error}</div>`;
        }
    }

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();

    // const array = data.error_list;
}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    let heading = 'API Key Status';
    let results = `<div>Your key is valid until</div>`;
    results += `<div class='key-status'>${data.expiry}</div>`;

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}
