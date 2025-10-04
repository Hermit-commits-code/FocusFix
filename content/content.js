// FocusFix Content Script
// Debug banner for confirming script is running
chrome.storage.sync.get(["debugMode"], (result) => {
  if (result.debugMode || !("update_url" in chrome.runtime.getManifest())) {
    if (!document.getElementById('focusfix-debug-banner')) {
      const banner = document.createElement('div');
      banner.id = 'focusfix-debug-banner';
      banner.textContent = 'FocusFix active';
      banner.style.position = 'fixed';
      banner.style.bottom = '12px';
      banner.style.right = '12px';
      banner.style.background = '#1976d2';
      banner.style.color = '#fff';
      banner.style.padding = '6px 16px';
      banner.style.zIndex = '99999';
      banner.style.fontSize = '14px';
      banner.style.borderRadius = '6px';
      banner.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      document.body.appendChild(banner);
    }
  }
});
// Injects accessibility fixes into web pages

// Global state for features

let settings = {
  focusOutlineEnabled: true,
  skipLinkEnabled: true,
  tabindexRepairEnabled: true,
  alwaysShowSkipLinks: false,
  highContrast: false,
  outlineColor: "#1976d2"
};

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

// --- Modularized imports ---
import { injectFocusOutline } from "./modules/focusOutline.js";
import { addSkipToContent } from "./modules/skipLinks.js";
import { repairTabindexOrder } from "./modules/tabOrder.js";
import { registerKeyboardShortcuts } from "./modules/keyboardShortcuts.js";
import { registerFocusContextHighlighting } from "./modules/focusContext.js";
import { registerSmartFocusManagement } from "./modules/smartFocus.js";

// --- Initialize all features ---
injectFocusOutline(settings, diagnostics);
addSkipToContent(diagnostics);
repairTabindexOrder(diagnostics);
registerKeyboardShortcuts(features);
registerFocusContextHighlighting();
registerSmartFocusManagement();
    function showTabOrderOverlay() {
      // Remove any existing overlay
      document.querySelectorAll('.focusfix-taborder-overlay').forEach(el => el.remove());

      // Helper to create overlay label
      function createOverlayLabel(target, index) {
        const rect = target.getBoundingClientRect();
        const label = document.createElement('div');
        label.className = 'focusfix-taborder-overlay';
        label.textContent = index + 1;
        label.style.position = 'fixed';
        label.style.left = `${rect.left + window.scrollX}px`;
        label.style.top = `${rect.top + window.scrollY}px`;
        label.style.width = '24px';
        label.style.height = '24px';
        label.style.background = 'rgba(25, 118, 210, 0.85)';
        label.style.color = '#fff';
        label.style.fontWeight = 'bold';
        label.style.fontSize = '16px';
        label.style.borderRadius = '50%';
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.justifyContent = 'center';
        label.style.zIndex = '2147483647';
        label.style.pointerEvents = 'none';
        label.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        document.body.appendChild(label);
      }

      // Show overlays for navs
      const navs = document.querySelectorAll(
        'nav, [role="navigation"], [role="main"], [role="banner"], [role="complementary"], [role="contentinfo"], .nav, .navbar, .menu'
      );
      navs.forEach(nav => {
        if (nav._focusfixTabOrder && nav._focusfixTabOrder.length > 0) {
          nav._focusfixTabOrder.forEach((el, idx) => {
            createOverlayLabel(el, idx);
          });
        }
      });
      // Show overlays for forms
      const forms = document.querySelectorAll('form, [role="form"]');
      forms.forEach(form => {
        if (form._focusfixTabOrder && form._focusfixTabOrder.length > 0) {
          form._focusfixTabOrder.forEach((el, idx) => {
            createOverlayLabel(el, idx);
          });
        }
      });
    }

    // Expose overlay function for diagnostics/debug
    window.focusfixShowTabOrderOverlay = showTabOrderOverlay;
  // --- Performance Optimizations ---
  // Throttle overlay rendering to avoid excessive DOM updates
  let overlayTimeout = null;
  function throttledShowOverlay() {
    if (overlayTimeout) clearTimeout(overlayTimeout);
    overlayTimeout = setTimeout(() => {
      if (overlayVisible) window.focusfixShowTabOrderOverlay();
    }, 200);
  }

  // Use MutationObserver to update tab order overlay on DOM changes
  const observer = new MutationObserver(() => {
    throttledShowOverlay();
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true });

  // Clean up overlays and observer on page unload
  window.addEventListener('beforeunload', () => {
    document.querySelectorAll('.focusfix-taborder-overlay').forEach(el => el.remove());
    observer.disconnect();
  });
  // Keyboard shortcut: Alt+Shift+O to show/hide tab order overlay
  let overlayVisible = false;
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.code === 'KeyO') {
      overlayVisible = !overlayVisible;
      if (overlayVisible) {
        window.focusfixShowTabOrderOverlay();
      } else {
        document.querySelectorAll('.focusfix-taborder-overlay').forEach(el => el.remove());
      }
    }
  });
// Removed obsolete IIFE closure after modularization                                     

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
    const msgSettings = message.settings;
    // High contrast mode toggle
    if (msgSettings.highContrast) {
      document.documentElement.setAttribute("data-focusfix-contrast", "high");
    } else {
      document.documentElement.removeAttribute("data-focusfix-contrast");
    }
    // Custom focus outline color, thickness, and animation
    if (msgSettings.outlineColor || msgSettings.outlineThickness || msgSettings.outlineAnimation) {
      const style = document.getElementById("focusfix-focus-outline-style");
      if (style) {
        let thickness = msgSettings.outlineThickness || 3;
        let color = msgSettings.outlineColor || "#1976d2";
        let animation = msgSettings.outlineAnimation || "ring";
        let animationCSS = "";
        if (animation === "ring") {
          animationCSS = `animation: focusfix-ring 0.4s ease;`;
        } else if (animation === "pulse") {
          animationCSS = `animation: focusfix-pulse 0.6s infinite;`;
        }
        style.textContent = `
          button:focus, input:focus {
            outline: ${thickness}px solid ${color} !important;
            outline-offset: 3px !important;
            box-shadow: 0 0 0 3px #fff, 0 0 0 6px ${color};
            transition: outline-color 0.2s, box-shadow 0.2s;
            ${animationCSS}
          }
          a:focus {
            outline: ${thickness}px dashed ${color} !important;
            outline-offset: 3px !important;
            box-shadow: 0 0 0 3px #fff, 0 0 0 6px ${color};
            transition: outline-color 0.2s, box-shadow 0.2s;
            ${animationCSS}
          }
          textarea:focus, select:focus, [tabindex]:focus {
            outline: ${thickness}px solid #222 !important;
            outline-offset: 3px !important;
            box-shadow: 0 0 0 3px #fff, 0 0 0 6px #222;
            transition: outline-color 0.2s, box-shadow 0.2s;
            ${animationCSS}
          }
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
            0% { box-shadow: 0 0 0 0 ${color}; }
            50% { box-shadow: 0 0 0 8px ${color}44; }
            100% { box-shadow: 0 0 0 6px ${color}; }
          }
          @keyframes focusfix-pulse {
            0% { outline-color: ${color}; }
            50% { outline-color: #fff; }
            100% { outline-color: ${color}; }
          }
        `;
      }
      const skipLink = document.querySelector('a[href="#main-content"]');
      if (skipLink) {
        skipLink.style.background = msgSettings.outlineColor;
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
