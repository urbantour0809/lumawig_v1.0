const browser = chrome;

function injectContentScriptOnCurrentTab() {
  try {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const tab = tabs[0];
      if (tab && !tab.url.startsWith("chrome://")) {
        browser.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["./dist/bundle.js"],
        }).catch((error) => {
          console.error("Error when injecting content script:", error);
        });
      }
    }).catch((error) => {
      console.error("Error when querying tabs:", error);
    });
  } catch (error) {
    console.error("Error when injecting content script:", error);
  }
}

browser.tabs.onActivated.addListener(({ tabId }) => {
  injectContentScriptOnCurrentTab();
});

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    injectContentScriptOnCurrentTab();
  }
});
