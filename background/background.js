// FocusFix background script (Manifest V3 + fallback compatibility)
// Handles extension lifecycle, settings sync, and messaging

// Compatibility check for different browser contexts
const isServiceWorker = typeof importScripts === "function";
const browser = chrome || browser; // Support both Chrome and Firefox APIs

// Initialize default settings on install
chrome.runtime.onInstalled.addListener(() => {
  console.log("FocusFix installed/updated");

  // Initialize default settings
  chrome.storage.sync
    .set({
      focusOutlineEnabled: true,
      skipLinkEnabled: true,
      tabindexRepairEnabled: true,
      outlineColor: "#1976d2",
      whitelist: "",
      blacklist: "",
    })
    .then(() => {
      console.log("Default settings initialized");
    })
    .catch((error) => {
      console.error("Failed to initialize settings:", error);
    });
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message.action);

  if (message.action === "toggleFeature") {
    // Forward toggle message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, message).catch((error) => {
          console.warn("Failed to send toggle message:", error);
        });
      }
    });
  } else if (message.action === "getDiagnostics") {
    // Forward diagnostics request to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs
          .sendMessage(tabs[0].id, message, (response) => {
            sendResponse(response);
          })
          .catch((error) => {
            console.warn("Failed to get diagnostics:", error);
            sendResponse({ error: "Failed to get diagnostics" });
          });
      }
    });
    return true; // Keep message channel open for async response
  }
});
