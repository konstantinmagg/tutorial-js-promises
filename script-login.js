if (window.Promise) {
    console.log("All fine.");
} else {
    console.error("Problem.");
}

var url = 'story.json';
var foo = new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();

    request.open('GET', url);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            resolve(request.response);
        } else {
            reject(Error(request.statusText));
        }
    };

    request.onerror = function() {
        reject(Error('Error fetching data.'));
    };

    request.send();
    console.log('Async request sent.');
});

foo.then(function(data) {
    console.log('Promise fulfilled.');
    document.getElementsByTagName('p')[0].textContent = data;
}, function(error) {
    console.error('Promise rejected: ' + error.message);
});
