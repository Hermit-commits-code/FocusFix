// FocusFix Popup Script
// Handles toggling features and displaying diagnostics

// Initialize popup with current settings
document.addEventListener("DOMContentLoaded", () => {
  // Load settings from storage
  chrome.storage.sync.get(
    ["focusOutlineEnabled", "skipLinkEnabled", "tabindexRepairEnabled"],
    (result) => {
      document.getElementById("toggleFocusOutline").checked =
        result.focusOutlineEnabled !== false;
      document.getElementById("toggleSkipLink").checked =
        result.skipLinkEnabled !== false;
      document.getElementById("toggleTabindex").checked =
        result.tabindexRepairEnabled !== false;
    }
  );
});

// Handle feature toggles
document
  .getElementById("toggleFocusOutline")
  .addEventListener("change", (e) => {
    const enabled = e.target.checked;
    chrome.storage.sync.set({ focusOutlineEnabled: enabled });
    chrome.runtime.sendMessage({
      action: "toggleFeature",
      feature: "focusOutlineEnabled",
      enabled,
    });
  });

document.getElementById("toggleSkipLink").addEventListener("change", (e) => {
  const enabled = e.target.checked;
  chrome.storage.sync.set({ skipLinkEnabled: enabled });
  chrome.runtime.sendMessage({
    action: "toggleFeature",
    feature: "skipLinkEnabled",
    enabled,
  });
});

document.getElementById("toggleTabindex").addEventListener("change", (e) => {
  const enabled = e.target.checked;
  chrome.storage.sync.set({ tabindexRepairEnabled: enabled });
  chrome.runtime.sendMessage({
    action: "toggleFeature",
    feature: "tabindexRepairEnabled",
    enabled,
  });
});

// Handle diagnostics request
document.getElementById("diagnosticsBtn").addEventListener("click", () => {
// Handle tab order overlay trigger
document.getElementById("tabOrderBtn").addEventListener("click", () => {
  // Send message to content script to show tab order overlay
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          if (window.focusfixShowTabOrderOverlay) {
            window.focusfixShowTabOrderOverlay();
          }
        }
      });
    }
  });
});
  chrome.runtime.sendMessage({ action: "getDiagnostics" }, (response) => {
    if (response) {
      const diagnosticsDiv = document.getElementById("diagnostics");
      diagnosticsDiv.innerHTML = `
        <strong>Accessibility Diagnostics:</strong><br>
        • Focusable elements: ${response.focusIssues}<br>
        • Skip link missing: ${response.skipLinkMissing ? "Yes" : "No"}<br>
        • Tabindex issues fixed: ${response.tabindexIssues}<br>
        • URL: ${response.url}<br>
        • Scanned: ${new Date(response.timestamp).toLocaleTimeString()}
      `;
    }
  });
});

// Handle CSV export
document.getElementById("exportCsvBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "getDiagnostics" }, (response) => {
    if (response) {
      // Create CSV content
      const csvContent = [
        [
          "URL",
          "Timestamp",
          "Focusable Elements",
          "Skip Link Missing",
          "Tabindex Issues Fixed",
        ],
        [
          response.url,
          response.timestamp,
          response.focusIssues,
          response.skipLinkMissing ? "Yes" : "No",
          response.tabindexIssues,
        ],
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `focusfix-report-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      URL.revokeObjectURL(url);

      // Show feedback
      const button = document.getElementById("exportCsvBtn");
      const originalText = button.textContent;
      button.textContent = "Exported!";
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }
  });
});
