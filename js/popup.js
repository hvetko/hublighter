/**
 * Open options page
 */
function openOption() {
    window.open(chrome.extension.getURL("html/options.html"), '_blank');
}

/**
 * Restore values from storage or take the default ones
 */
function restoreOptions() {
    chrome.storage.sync.get({
        // Default values
        backgroundColor: '#00BFFF',
        textColor: '#FFFFFF',
        borderColor: '#00688B'
    }, function (items) {
        document.getElementById('background-color').style.background = items.backgroundColor;
        document.getElementById('text-color').style.background = items.textColor;
        document.getElementById('border-color').style.background = items.borderColor;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('option-link').addEventListener('click', openOption);
