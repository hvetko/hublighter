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
 * Escape Regex special characters
 *
 * @param text
 * @returns {string}
 */
function escapeCodes(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/**
 * Adds highlight to selection
 */
function addSimpleHighlight() {
	var highlightedText = window.getSelection().toString().trim();

	if (!isActiveHighlight && highlightedText) {
		var blobCodeTds = $('table tr td.blob-code');
		doHublighting(blobCodeTds, highlightedText);

		blobCodeTds.each(function () {
			var htmlCodes = $(this).html();
			var newHtml = htmlCodes.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
			$(this).html(newHtml);
		});

		isActiveHighlight = true;
	}
}

function doHublighting(elem, highlightedText) {
	var highlightedSpan = getHighlightedSpan(highlightedText);

	elem.contents().filter(function () {
		return this.nodeType === 3 && this.textContent.indexOf(highlightedText) >= 0
	}).each(function () {
		this.textContent = this.textContent.replace(highlightedText, highlightedSpan);
	});

	elem.children().each(function () {
		if ($(this).text().includes(highlightedText)) {
			doHublighting($(this), highlightedText);
		}
	});
}

/**
 * Removes highlight from the page and add new one if needed
 */
function removeSimpleHighlight() {
	$('span.github-highlighter-marked').each(function () {
		var element = $(this);
		var highlightedText = element.html();
		var re = new RegExp(getHighlightedSpan(escapeCodes(highlightedText)), "g");

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
