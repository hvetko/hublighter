/**
 * Saves options to chrome.storage
 */
function saveOptions() {
	document.getElementById('save').disabled = true;
	document.getElementById('save').firstChild.data = 'Saving...';
	chrome.storage.sync.set({
		backgroundColor: document.getElementById('background-color').value,
		textColor: document.getElementById('text-color').value,
		useBorder: document.getElementById('use-border').checked,
		borderColor: document.getElementById('border-color').value
	}, function () {
		document.getElementById('status').style.display = 'block';
		setTimeout(function () {
			document.getElementById('status').style.display = 'none';
		}, 1000);
		document.getElementById('save').disabled = false;
		document.getElementById('save').firstChild.data = 'Save';
	});
}

/**
 * Restore values from storage or take the default ones
 */
function restoreOptions() {
	chrome.storage.sync.get({
		// Default values
		backgroundColor: '#00BFFF',
		textColor: '#FFFFFF',
		useBorder: false,
		borderColor: '#00688B'
	}, function (items) {
		document.getElementById('background-color').value = items.backgroundColor;
		document.getElementById('text-color').value = items.textColor;
		document.getElementById('use-border').checked = items.useBorder;
		document.getElementById('border-color').value = items.borderColor;
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
