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
 * Replace all substring occurrences
 *
 * @param search
 * @param replacement
 *
 * @returns {string}
 */
String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.replace(new RegExp(escapeCodes(search), 'g'), replacement);
};

/**
 * Returns HTML code for highlighted span element
 *
 * @param {string} highlightedText
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
 *
 * @param {string} highlightedText
 *
 * @returns {string}
 */
function getHublightHash(highlightedText) {
	String.prototype.hashCode = function () {
		var hash = 0, i, chr;
		if (this.length === 0) return hash;
		for (i = 0; i < this.length; i++) {
			chr = this.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return 'HUBLIGHTER' + Math.abs(hash);
	};

	return highlightedText.hashCode();
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
 * It's a two-step process. First the selected string is replaced with hash.
 * Then, the hash is replaced with html highlighting
 */
function addSimpleHighlight() {
	var highlightedText = window.getSelection().toString().trim();

	if (!isActiveHighlight && highlightedText) {
		var blobCodeTds = $('table tr td.blob-code');
		doHashing(blobCodeTds, highlightedText);
		doHublighting(blobCodeTds, highlightedText);

		isActiveHighlight = true;
	}
}

/**
 * Replaces selected string with hash
 *
 * @param elem
 * @param highlightedText
 */
function doHashing(elem, highlightedText) {
	var highlightedHash = getHublightHash(highlightedText);

	elem.contents().filter(function () {
		return this.nodeType === 3 && this.textContent.indexOf(highlightedText) >= 0
	}).each(function () {
		this.textContent = this.textContent.replaceAll(highlightedText, highlightedHash);
	});

	elem.children().each(function () {
		if ($(this).text().includes(highlightedText)) {
			doHashing($(this), highlightedText);
		}
	});
}

/**
 * Replaces hash with highlight
 *
 * @param elem
 * @param highlightedText
 */
function doHublighting(elem, highlightedText) {
	var highlightedHash = getHublightHash(highlightedText);
	var highlightedSpan = getHighlightedSpan(highlightedText);

	elem.each(function () {
		if ($(this).text().indexOf(highlightedHash) >= 0) {
			var hashedHTML = $(this).html();
			var hublightedHtml = hashedHTML.replaceAll(highlightedHash, highlightedSpan);
			$(this).html(hublightedHtml);
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
