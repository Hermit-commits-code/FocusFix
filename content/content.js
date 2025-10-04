// FocusFix Content Script
// Injects accessibility fixes into web pages

// Global state for features
let features = {
  focusOutlineEnabled: true,
  skipLinkEnabled: true,
  tabindexRepairEnabled: true,
};

let diagnostics = {
  focusIssues: 0,
  skipLinkMissing: false,
  tabindexIssues: 0,
};

// --- 1. Inject visible focus outlines ---
(function injectFocusOutline() {
  const styleId = "focusfix-focus-outline-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* FocusFix: visible focus outlines for all focusable elements */
      button:focus, a:focus, input:focus, textarea:focus, select:focus, [tabindex]:focus {
        outline: 2px solid #1976d2 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px #1976d2;
      }
    `;
    document.head.appendChild(style);
  }

  // Count elements that might have focus issues
  const focusableElements = document.querySelectorAll(
    "button, a, input, textarea, select, [tabindex]"
  );
  diagnostics.focusIssues = focusableElements.length;
})();

// --- 2. Add "Skip to Content" link if missing ---
(function addSkipToContent() {
  const existingSkipLink = document.querySelector(
    'a[href="#main-content"], a[href="#content"], a[href="#main"]'
  );
  if (!existingSkipLink) {
    diagnostics.skipLinkMissing = true;

    const skipLink = document.createElement("a");
    skipLink.href = "#main-content";
    skipLink.textContent = "Skip to Content";
    skipLink.style.position = "absolute";
    skipLink.style.top = "0";
    skipLink.style.left = "0";
    skipLink.style.background = "#1976d2";
    skipLink.style.color = "#fff";
    skipLink.style.padding = "8px 16px";
    skipLink.style.zIndex = "9999";
    skipLink.style.transform = "translateY(-100%)";
    skipLink.style.transition = "transform 0.2s";
    skipLink.style.textDecoration = "none";
    skipLink.setAttribute("tabindex", "0");
    skipLink.addEventListener("focus", () => {
      skipLink.style.transform = "translateY(0)";
    });
    skipLink.addEventListener("blur", () => {
      skipLink.style.transform = "translateY(-100%)";
    });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content anchor if missing
    if (
      !document.getElementById("main-content") &&
      !document.getElementById("content") &&
      !document.getElementById("main")
    ) {
      const main = document.createElement("div");
      main.id = "main-content";
      main.tabIndex = -1;
      const mainContent = document.querySelector(
        'main, [role="main"], .main-content, .content'
      );
      if (mainContent) {
        mainContent.parentNode.insertBefore(main, mainContent);
      } else {
        document.body.appendChild(main);
      }
    }
  }
})();

// --- 3. Repair tabindex order in navbars/forms ---
(function repairTabindexOrder() {
  let tabindexIssues = 0;

  // Find navigation elements with bad tabindex order
  const navs = document.querySelectorAll(
    'nav, [role="navigation"], .nav, .navbar, .menu'
  );
  navs.forEach((nav) => {
    const focusableElements = nav.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements.forEach((el, index) => {
      // Only set tabindex if it's missing or incorrectly set
      const currentTabindex = parseInt(el.getAttribute("tabindex") || "0");
      if (currentTabindex > 0 || el.getAttribute("tabindex") === null) {
        el.setAttribute("tabindex", "0"); // Use 0 for natural tab order
        tabindexIssues++;
      }
    });
  });

  // Find forms with bad tabindex order
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    const formElements = form.querySelectorAll(
      'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
    );
    let tabIndex = 1;
    formElements.forEach((el) => {
      // Skip if already has proper tabindex
      const currentTabindex = parseInt(el.getAttribute("tabindex") || "0");
      if (currentTabindex <= 0 || currentTabindex > formElements.length) {
        el.setAttribute("tabindex", tabIndex.toString());
        tabIndex++;
        tabindexIssues++;
      }
    });
  });

  // Fix elements with tabindex > 0 outside of forms (anti-pattern)
  const highTabindexElements = document.querySelectorAll(
    '[tabindex]:not([tabindex="0"]):not([tabindex="-1"])'
  );
  highTabindexElements.forEach((el) => {
    const tabindex = parseInt(el.getAttribute("tabindex"));
    if (tabindex > 0) {
      // Check if it's not in a form (forms handle their own tabindex)
      if (!el.closest("form")) {
        el.setAttribute("tabindex", "0");
        tabindexIssues++;
      }
    }
  });

  diagnostics.tabindexIssues = tabindexIssues;
})();

// Message handling for popup communication
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleFeature") {
    const { feature, enabled } = message;
    features[feature] = enabled;

    if (feature === "focusOutlineEnabled") {
      const style = document.getElementById("focusfix-focus-outline-style");
      if (style) {
        style.disabled = !enabled;
      }
    } else if (feature === "skipLinkEnabled") {
      const skipLink = document.querySelector('a[href="#main-content"]');
      if (skipLink) {
        skipLink.style.display = enabled ? "block" : "none";
      }
    }
    // tabindexRepairEnabled would require re-running the repair function
  } else if (message.action === "getDiagnostics") {
    sendResponse({
      ...diagnostics,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });
  } else if (message.action === "updateSettings") {
    const { settings } = message;
    // Update focus outline color
    const style = document.getElementById("focusfix-focus-outline-style");
    if (style && settings.outlineColor) {
      style.textContent = `
        /* FocusFix: visible focus outlines for all focusable elements */
        button:focus, a:focus, input:focus, textarea:focus, select:focus, [tabindex]:focus {
          outline: 2px solid ${settings.outlineColor} !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px ${settings.outlineColor};
        }
      `;
    }

    // Update skip link color to match
    const skipLink = document.querySelector('a[href="#main-content"]');
    if (skipLink && settings.outlineColor) {
      skipLink.style.background = settings.outlineColor;
    }
  }
});

// Load settings on page load and apply them
chrome.storage.sync.get(
  [
    "outlineColor",
    "focusOutlineEnabled",
    "skipLinkEnabled",
    "tabindexRepairEnabled",
  ],
  (result) => {
    if (result.outlineColor) {
      const style = document.getElementById("focusfix-focus-outline-style");
      if (style) {
        style.textContent = `
        /* FocusFix: visible focus outlines for all focusable elements */
        button:focus, a:focus, input:focus, textarea:focus, select:focus, [tabindex]:focus {
          outline: 2px solid ${result.outlineColor} !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px ${result.outlineColor};
        }
      `;
      }
    }

    features.focusOutlineEnabled = result.focusOutlineEnabled !== false;
    features.skipLinkEnabled = result.skipLinkEnabled !== false;
    features.tabindexRepairEnabled = result.tabindexRepairEnabled !== false;
  }
);
