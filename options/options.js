// FocusFix Options Script
// Handles settings for outline style and site activation

// Load settings on page load
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(
    ["outlineColor", "whitelist", "blacklist"],
    (result) => {
      document.getElementById("outlineColor").value =
        result.outlineColor || "#1976d2";
      document.getElementById("whitelist").value = result.whitelist || "";
      document.getElementById("blacklist").value = result.blacklist || "";
    }
  );
});

// Save settings
document
  .getElementById("settingsForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const settings = {
      outlineColor: document.getElementById("outlineColor").value,
      whitelist: document.getElementById("whitelist").value,
      blacklist: document.getElementById("blacklist").value,
    };

    chrome.storage.sync.set(settings, () => {
      // Update content script with new outline color
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "updateSettings",
          settings: settings,
        });
      });

      // Show success message
      const button = document.querySelector('button[type="submit"]');
      const originalText = button.textContent;
      button.textContent = "Settings Saved!";
      button.style.background = "#4caf50";
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "";
      }, 2000);
    });
  });
