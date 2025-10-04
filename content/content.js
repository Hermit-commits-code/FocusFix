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
      /* FocusFix: animated and high-contrast focus outlines */
      button:focus, input:focus {
        outline: 2.5px solid #1976d2 !important;
        outline-offset: 3px !important;
        box-shadow: 0 0 0 3px #fff, 0 0 0 6px #1976d2;
        transition: outline-color 0.2s, box-shadow 0.2s;
        animation: focusfix-ring 0.4s ease;
      }
      a:focus {
        outline: 2.5px dashed #1976d2 !important;
        outline-offset: 3px !important;
        box-shadow: 0 0 0 3px #fff, 0 0 0 6px #1976d2;
        transition: outline-color 0.2s, box-shadow 0.2s;
        animation: focusfix-ring 0.4s ease;
      }
      textarea:focus, select:focus, [tabindex]:focus {
        outline: 2.5px solid #222 !important;
        outline-offset: 3px !important;
        box-shadow: 0 0 0 3px #fff, 0 0 0 6px #222;
        transition: outline-color 0.2s, box-shadow 0.2s;
        animation: focusfix-ring 0.4s ease;
      }
      /* High contrast mode */
      html[data-focusfix-contrast="high"] button:focus,
      html[data-focusfix-contrast="high"] a:focus,
      html[data-focusfix-contrast="high"] input:focus,
      html[data-focusfix-contrast="high"] textarea:focus,
      html[data-focusfix-contrast="high"] select:focus,
      html[data-focusfix-contrast="high"] [tabindex]:focus {
        outline: 3px solid #ffeb3b !important;
        outline-offset: 4px !important;
        box-shadow: 0 0 0 4px #000, 0 0 0 8px #ffeb3b;
        background: #000 !important;
        color: #fff !important;
        animation: focusfix-ring 0.4s ease;
      }
      @keyframes focusfix-ring {
        0% { box-shadow: 0 0 0 0 #1976d2; }
        50% { box-shadow: 0 0 0 8px #1976d244; }
        100% { box-shadow: 0 0 0 6px #1976d2; }
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
  const skipTargets = [
    { id: "main-content", label: "Skip to Content" },
    { id: "nav", label: "Skip to Navigation" },
    { id: "footer", label: "Skip to Footer" }
  ];
  skipTargets.forEach(target => {
    const existingSkipLink = document.querySelector(`a[href="#${target.id}"]`);
    if (!existingSkipLink) {
      diagnostics.skipLinkMissing = true;
      const skipLink = document.createElement("a");
      skipLink.href = `#${target.id}`;
      skipLink.textContent = target.label;
      skipLink.className = "focusfix-skip-link";
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

      // Optionally always show skip links (user setting)
      if (window.focusfixAlwaysShowSkipLinks) {
        skipLink.style.transform = "translateY(0)";
      }

      // Add anchor if missing
      if (!document.getElementById(target.id)) {
        const anchor = document.createElement("div");
        anchor.id = target.id;
        anchor.tabIndex = -1;
        document.body.appendChild(anchor);
      }
    }
  });
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
    // Always show skip links if setting enabled
    if (settings.alwaysShowSkipLinks) {
      window.focusfixAlwaysShowSkipLinks = true;
      document.querySelectorAll('.focusfix-skip-link').forEach(link => {
        link.style.transform = "translateY(0)";
      });
    } else {
      window.focusfixAlwaysShowSkipLinks = false;
      document.querySelectorAll('.focusfix-skip-link').forEach(link => {
        link.style.transform = "translateY(-100%)";
      });
    }
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
    // High contrast mode toggle
    if (settings.highContrast) {
      document.documentElement.setAttribute("data-focusfix-contrast", "high");
    } else {
      document.documentElement.removeAttribute("data-focusfix-contrast");
    }
    // Custom focus outline color
    if (settings.outlineColor) {
      const style = document.getElementById("focusfix-focus-outline-style");
      if (style) {
        style.textContent = style.textContent.replace(/#1976d2/g, settings.outlineColor);
      }
      const skipLink = document.querySelector('a[href="#main-content"]');
      if (skipLink) {
        skipLink.style.background = settings.outlineColor;
      }
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
