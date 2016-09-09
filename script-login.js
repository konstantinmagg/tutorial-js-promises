if (window.Promise) {
    console.log("All fine.");
} else {
    console.error("Problem.");
}

function addContent(snippet) {
    document.getElementsByTagName('p')[0].innerHTML += snippet;
}

function clearContent() {
    document.getElementsByTagName('p')[0].innerHTML = "";
}

function getAsPromise(url) {
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

    return foo;
}

console.log('Call #0');

getAsPromise('story.json')
    .then(function(data) {
        console.log('Promise fulfilled.');
        var content = JSON.parse(data);

        return content; // return value to pass to next function as argument
    })
    .then(function(content) {
        var url = content.chapterUrls[0]; // 'chapter-1.json'
        console.log('Call #1');

        return getAsPromise(url); // return promise to enqueue
    })
    .then(function(data) {
        console.log('Promise fulfilled.');
        var chapter = JSON.parse(data);
        var template = '<h2>Chapter ' +
            chapter.number +
            ' &ndash; ' +
            chapter.title +
            '</h2><p>' +
            chapter.content +
            '</p>';
        clearContent();
        addContent(template);
        // document.getElementsByTagName('p')[0].innerHTML = template;
    })
    .catch(function(error) {
        // catches errors from any `getAsPromise()` call.
        console.error('Promise rejected: ' + error.message);
    });
