import {chrome} from "webextension-polyfill";

async function injectContentScriptOnCurrentTab() {
  try {
    const resultTabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = resultTabs[0];
    if (tab && !tab.url.startsWith("chrome://")) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["./dist/bundle.js"],
        });
      } catch (error) {
        console.error("Error when injecting content script:", error);
      }
    }
  } catch (error) {
    console.error("Error when querying tabs:", error);
  }
}

chrome.tabs.onActivated.addListener(({ tabId }) => {
  injectContentScriptOnCurrentTab();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    injectContentScriptOnCurrentTab();
  }
});
