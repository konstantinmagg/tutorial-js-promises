//
// Primitive HTML manipulation
//

/**
 * Clear inner HTML in the content paragraph.
 */
function clearHtmlContent() {
    document.getElementsByTagName('p')[0].innerHTML = "";
}

/**
 * Add a HTML snippet to the content paragraph.
 * @param {string} snippet Content to add. HTML syntax allowed.
 */
function addHtmlContent(snippet) {
    document.getElementsByTagName('p')[0].innerHTML += snippet;
}

//
// Promise functions
//

/**
 * Execute an HTTP get as async `Promise`.
 * @param  {string} url The URL to GET.
 * @return {object}     The Promise.
 */
function getAsPromise(url) {
    console.log('get ' + url);

    var promise = new Promise(function(resolve, reject) {
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

    return promise;
}

/**
 * Parse a story object.
 * Handle the promise fulfill of GET 'story'.
 * @param  {string} data The story as JSON.
 * @return {object}      The story as object.
 */
function parseStory(data) {
    console.log('Promise fulfilled.');
    var story = JSON.parse(data);

    clearHtmlContent();
    addHtmlContent('<h2>' + story.heading + '</h2>');

    return story; // return value to pass to next function as argument
}

/**
 * Parse a chapter object.
 * Handle the promise fulfill of GET 'chapter'.
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function parserChapter(data) {
    console.log('Promise fulfilled.');
    var chapter = JSON.parse(data);
    var template = '<h3>Chapter ' +
        chapter.number +
        ' &ndash; ' +
        chapter.title +
        '</h3><p>' +
        chapter.content +
        '</p>';

    addHtmlContent(template);

    return chapter;
}

/**
 * Initiate async GET calls for all chapters.
 * Chain async calls.
 * @param  {object} story The story definition with a list of chapter urls.
 * @return {object}       A sequence of promises to continue with.
 */
function getChapters(story) {
    return story.chapterUrls.map(getAsPromise)
        .reduce(function chainPromisesTogether(sequence, promiseForChapter) {
            return sequence.then(function waitForCurrentChapter() {
                    return promiseForChapter
                }).then(parserChapter)
                .then(function(item) {
                    console.log('Chapter ' + item.number + ' done.');
                });
        }, Promise.resolve());
}

/**
 * Print a final success message.
 */
function onSuccess() {
    console.log('All done.');
}

//
// Entry point for program execution
//

var status = window.Promise ? 'all fine.' : 'promises not supported.'
console.log('Checking browser: ' + status);

//// var sequence = Promise.resolve();  // todo: why is this line no longer needed?
getAsPromise('content/story.json')
    .then(parseStory)
    .then(getChapters)
    .then(onSuccess)
    .catch(function(error) {
        // catches errors from any `getAsPromise()` call.
        console.error('Promise rejected: ' + error.message);
    });
