/**
 * Flag to keep track if highlighter is on
 *
 * @type {boolean}
 */
var isActiveHighlight = false;

/**
 * Returns HTML code for highlighted span element
 *
 * @param highlightedText
 *
 * @returns {string}
 */
function getHighlightedSpan(highlightedText) {
    return '<span class="github-highlighter-marked">' + highlightedText + '</span>';
}

/**
 * Adds highlight to selection
 */
function addSimpleHighlight() {
    var highlightedText = window.getSelection().toString().trim();
    if (!isActiveHighlight && highlightedText) {
        $('table tr td').each(function (index) {
            var newHTML = $(this).html().replace(highlightedText, getHighlightedSpan(highlightedText));
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
