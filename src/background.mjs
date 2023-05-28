chrome.tabs.onActivated.addListener(({ tabId }) => {
  injectContentScriptOnCurrentTab();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    injectContentScriptOnCurrentTab();
  }
});

function injectContentScriptOnCurrentTab() {
  chrome.tabs.query({active: true, currentWindow: true})
    .then(tabs => {
      const activeTab = tabs[0];
      return chrome.tabs.executeScript(activeTab.id, {file: 'dist/bundle.js', allFrames: true});
    })
    .catch(err => {
      console.error("Error when injecting content script:", err);
    });
}