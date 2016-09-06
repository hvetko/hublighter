/**
 * Flag to keep track if highlighter is on
 *
 * @type {boolean}
 */
var isActiveHighlight = false;

var backgroundColor = null;
var textColor = null;
var useBorder = false;
var borderColor = null;

chrome.storage.sync.get({
    // Default values
    backgroundColor: '#00BFFF',
    textColor: '#FFFFFF',
    useBorder: false,
    borderColor: '#00688B'
}, function (items) {
    backgroundColor = items.backgroundColor;
    textColor = items.textColor;
    useBorder = items.useBorder;
    borderColor = items.borderColor;
});

/**
 * Returns HTML code for highlighted span element
 *
 * @param highlightedText
 *
 * @returns {string}
 */
function getHighlightedSpan(highlightedText) {
    var style = "background-color: " + backgroundColor + ";";
    style += "color: " + textColor + ";";
    if (useBorder) {
        style += "border: 1px solid " + borderColor + ";";
    }

    return '<span class="github-highlighter-marked" style="' + style + '">' + highlightedText + '</span>';
}

/**
 * Adds highlight to selection
 */
function addSimpleHighlight() {
    var highlightedText = window.getSelection().toString().trim();
    var highlightedSpan = getHighlightedSpan(highlightedText);
    if (!isActiveHighlight && highlightedText) {
        $('table tr td').each(function (index) {
            var newHTML = $(this).html().replace(highlightedText, highlightedSpan);
            $(this).html(newHTML);
        });

        isActiveHighlight = true;
    }
}

/**
 * Removes highlight from the page and add new one if needed
 */
function removeSimpleHighlight() {
    $('span.github-highlighter-marked').each(function (index) {
        var highlightedText = $(this).html();
        var newHTML = $(this).parent().html().replace(getHighlightedSpan(highlightedText), highlightedText);
        $(this).parent().html(newHTML);
    });

    isActiveHighlight = false;
}


$('body').click(function (event) {
    addSimpleHighlight();
}).dblclick(function () {
    removeSimpleHighlight();
    addSimpleHighlight();
});
