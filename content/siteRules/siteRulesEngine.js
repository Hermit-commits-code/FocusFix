// FocusFix Site-Specific Rules Engine
// Handles per-domain focus styles and behaviors

const SITE_RULES_KEY = 'focusfix_site_rules';

// Utility: Get current domain
function getDomain() {
  return window.location.hostname;
}

// Load all rules from local storage
export function loadAllSiteRules() {
  try {
    const raw = localStorage.getItem(SITE_RULES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

// Save all rules to local storage
export function saveAllSiteRules(rules) {
  localStorage.setItem(SITE_RULES_KEY, JSON.stringify(rules));
}

// Get rules for current site
export function getCurrentSiteRules() {
  const domain = getDomain();
  const allRules = loadAllSiteRules();
  return allRules[domain] || {};
}

// Set rules for current site
export function setCurrentSiteRules(rules) {
  const domain = getDomain();
  const allRules = loadAllSiteRules();
  allRules[domain] = rules;
  saveAllSiteRules(allRules);
}

// Apply rules to page (stub)
export function applySiteRules(rules) {
  // Example: apply custom focus style
  if (rules.focusStyle) {
    const style = document.createElement('style');
    style.textContent = `:focus { outline: ${rules.focusStyle}; }`;
    document.head.appendChild(style);
  }
  // Extend for more behaviors
}

// Export rules as JSON
export function exportRules() {
  return JSON.stringify(loadAllSiteRules(), null, 2);
}

// Import rules from JSON
export function importRules(json) {
  try {
    const rules = JSON.parse(json);
    saveAllSiteRules(rules);
    return true;
  } catch (e) {
    return false;
  }
}
