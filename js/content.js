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

/**
 * Get storage values
 */
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
    var style = "background-color: " + backgroundColor + "; color: " + textColor + ";";

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
        $('table tr td.blob-code').each(function () {
            var element = $(this);

            if (element.text().includes(highlightedText) && element.html().includes(highlightedText)) {
                // Replace only within visible span
                element.children().each(function () {
                    var child = $(this);
                    if (child.hasClass('blob-code-inner')) {
                        var childHTML = child.html().replace(re, highlightedSpan);
                        if (child.html() !== childHTML) {
                            child.html(childHTML);
                        }
                    }
                });
            }
        });

        isActiveHighlight = true;
    }
}

/**
 * Removes highlight from the page and add new one if needed
 */
function removeSimpleHighlight() {
    $('span.github-highlighter-marked').each(function () {
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


$('body').click(function () {
    addSimpleHighlight();
}).dblclick(function () {
    removeSimpleHighlight();
    addSimpleHighlight();
});
