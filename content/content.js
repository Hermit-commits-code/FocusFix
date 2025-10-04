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

// --- 1. Inject visible focus outlines ---
(function injectFocusOutline() {
  const styleId = "focusfix-focus-outline-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    let thickness = settings.outlineThickness || 3;
    let color = settings.outlineColor || "#1976d2";
    let animation = settings.outlineAnimation || "ring";
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

    // Find navigation elements and ARIA landmarks with bad tabindex order
    const navs = document.querySelectorAll(
      'nav, [role="navigation"], [role="main"], [role="banner"], [role="complementary"], [role="contentinfo"], .nav, .navbar, .menu'
    );
    navs.forEach((nav) => {
      // Include ARIA roles and custom focusable selectors
      const focusableElements = nav.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"], [role="textbox"], [role="searchbox"]'
      );
      let tabOrder = [];
      focusableElements.forEach((el, index) => {
        // Only set tabindex if it's missing or incorrectly set
        const currentTabindex = parseInt(el.getAttribute("tabindex") || "0");
        if (currentTabindex > 0 || el.getAttribute("tabindex") === null) {
          el.setAttribute("tabindex", "0"); // Use 0 for natural tab order
          tabindexIssues++;
        }
        tabOrder.push(el);
      });
      // Store tab order for visual overlay
      nav._focusfixTabOrder = tabOrder;
    });

    // Find forms and ARIA form regions with bad tabindex order
    const forms = document.querySelectorAll("form, [role='form']");
    forms.forEach((form) => {
      const formElements = form.querySelectorAll(
        'input, textarea, select, button, [tabindex]:not([tabindex="-1"]), [role="button"], [role="textbox"]'
      );
      let tabIndex = 1;
      let tabOrder = [];
      formElements.forEach((el) => {
        // Skip if already has proper tabindex
        const currentTabindex = parseInt(el.getAttribute("tabindex") || "0");
        if (currentTabindex <= 0 || currentTabindex > formElements.length) {
          el.setAttribute("tabindex", tabIndex.toString());
          tabIndex++;
          tabindexIssues++;
        }
        tabOrder.push(el);
      });
      // Store tab order for visual overlay
      form._focusfixTabOrder = tabOrder;
    });

    // Fix elements with tabindex > 0 outside of forms/landmarks (anti-pattern)
    const highTabindexElements = document.querySelectorAll(
      '[tabindex]:not([tabindex="0"]):not([tabindex="-1"] )'
    );
    highTabindexElements.forEach((el) => {
      const tabindex = parseInt(el.getAttribute("tabindex"));
      if (tabindex > 0) {
        // Check if it's not in a form or ARIA landmark
        if (!el.closest("form") && !el.closest("nav, [role='navigation'], [role='main'], [role='banner'], [role='complementary'], [role='contentinfo']")) {
          el.setAttribute("tabindex", "0");
          tabindexIssues++;
        }
      }
    });

  diagnostics.tabindexIssues = tabindexIssues;
    // --- Visual Tab Order Preview Overlay ---
// --- Keyboard Shortcuts Module ---
// --- Focus Context Highlighting Module ---
// --- Smart Focus Management Module ---
  // Logical focus flow: skip decorative elements
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      let el = document.activeElement;
      if (el && el.hasAttribute('aria-hidden')) {
        e.preventDefault();
        let next = el.nextElementSibling;
        while (next && next.hasAttribute('aria-hidden')) {
          next = next.nextElementSibling;
        }
        if (next) next.focus();
      }
    }
  });

  // Focus group navigation: arrow keys in menus/tabs
  document.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      let el = document.activeElement;
      let group = el.closest('[role="menu"], [role="tablist"], .menu, .tablist');
      if (group) {
        let items = Array.from(group.querySelectorAll('[role="menuitem"], [role="tab"], .menuitem, .tab'));
        let idx = items.indexOf(el);
        if (idx !== -1) {
          let nextIdx = idx;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIdx++;
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIdx--;
          nextIdx = (nextIdx + items.length) % items.length;
          items[nextIdx].focus();
          e.preventDefault();
        }
      }
    }
  });
(function smartFocusManagement() {
  // Modal focus trapping
  function trapFocus(modal) {
    const focusable = modal.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    modal.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }
  // Auto-detect modals and apply trapping
  const observer = new MutationObserver(() => {
    document.querySelectorAll('[role="dialog"], .modal, .focusfix-modal').forEach(modal => {
      if (!modal._focusfixTrapped) {
        trapFocus(modal);
        modal._focusfixTrapped = true;
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Focus restoration after modal close
  let lastTrigger = null;
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-open-modal]')) {
      lastTrigger = e.target;
    }
  });
  document.addEventListener('focusout', (e) => {
    if (e.target.matches('[role="dialog"], .modal, .focusfix-modal')) {
      setTimeout(() => {
        if (lastTrigger) lastTrigger.focus();
      }, 100);
    }
  });
})();
(function focusContextHighlighting() {
  let lastContext = null;
  function highlightContext(el) {
    // Remove previous highlight
    if (lastContext) {
      lastContext.classList.remove('focusfix-context-highlight');
    }
    // Find nearest nav, section, aside, or main
    const context = el.closest('nav, section, aside, main, [role="navigation"], [role="main"], [role="region"], [role="banner"], [role="complementary"]');
    if (context) {
      context.classList.add('focusfix-context-highlight');
      lastContext = context;
    }
  }
  // Add highlight style
  if (!document.getElementById('focusfix-context-style')) {
    const style = document.createElement('style');
    style.id = 'focusfix-context-style';
    style.textContent = `.focusfix-context-highlight {
      box-shadow: 0 0 0 4px #ffeb3b88, 0 0 12px 2px #1976d2;
      transition: box-shadow 0.2s;
    }`;
    document.head.appendChild(style);
  }
  // Listen for focus events on all focusable elements
  document.addEventListener('focusin', (e) => {
    highlightContext(e.target);
  });
  document.addEventListener('focusout', () => {
    if (lastContext) lastContext.classList.remove('focusfix-context-highlight');
    lastContext = null;
  });
})();
(function keyboardShortcuts() {
  // Toggle focus outlines: Alt+Shift+F
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.code === 'KeyF') {
      features.focusOutlineEnabled = !features.focusOutlineEnabled;
      const style = document.getElementById('focusfix-focus-outline-style');
      if (style) style.disabled = !features.focusOutlineEnabled;
    }
  });

  // Skip to main content: Alt+Shift+S
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.code === 'KeyS') {
      const main = document.getElementById('main-content');
      if (main) {
        main.tabIndex = -1;
        main.focus();
      }
    }
  });

  // Show/hide tab order overlay: Alt+Shift+O (already implemented)
  // Additional shortcut: Alt+Shift+K to toggle skip links
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.code === 'KeyK') {
      window.focusfixAlwaysShowSkipLinks = !window.focusfixAlwaysShowSkipLinks;
      document.querySelectorAll('.focusfix-skip-link').forEach(link => {
        link.style.transform = window.focusfixAlwaysShowSkipLinks ? 'translateY(0)' : 'translateY(-100%)';
      });
    }
  });
})();
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
    // Custom focus outline color, thickness, and animation
    if (settings.outlineColor || settings.outlineThickness || settings.outlineAnimation) {
      const style = document.getElementById("focusfix-focus-outline-style");
      if (style) {
        let thickness = settings.outlineThickness || 3;
        let color = settings.outlineColor || "#1976d2";
        let animation = settings.outlineAnimation || "ring";
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
