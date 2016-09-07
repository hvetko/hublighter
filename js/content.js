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
    var re = new RegExp(highlightedText, "g");
    var highlightedSpan = getHighlightedSpan(highlightedText);
    if (!isActiveHighlight && highlightedText) {
        $('table tr td.blob-code').each(function (index) {
            var element = $(this);
            if (element.text().includes(highlightedText)) {
                var newHTML = element.html().replace(re, highlightedSpan);

                if (element.html() !== newHTML) {
                    element.html(newHTML);
                    isActiveHighlight = true;
                }
            }
        });

        isActiveHighlight = true;
    }
}

/**
 * Removes highlight from the page and add new one if needed
 */
function removeSimpleHighlight() {
    $('span.github-highlighter-marked').each(function (index) {
        var element = $(this);
        var highlightedText = element.html();
        var re = new RegExp(getHighlightedSpan(highlightedText), "g");
        if (element.parent().html()) {
            var newHTML = element.parent().html().replace(re, highlightedText);
            element.parent().html(newHTML);
        }
    });

    isActiveHighlight = false;
}


$('body').click(function (event) {
    addSimpleHighlight();
}).dblclick(function () {
    removeSimpleHighlight();
    addSimpleHighlight();
});
