// FocusFix Rule Marketplace (local simulation)
// Simulates a community pool of site-specific rules

export const marketplaceRules = [
  {
    domain: 'example.com',
    rules: {
      focusStyle: '2px solid #ff9800',
      skipLinks: true,
    },
    contributor: 'AccessibilityPro',
    description: 'Improved focus ring and skip links for example.com',
  },
  {
    domain: 'news.site',
    rules: {
      focusStyle: '3px dashed #2196f3',
      tabOrder: 'logical',
    },
    contributor: 'TabMaster',
    description: 'Logical tab order and high-contrast focus for news.site',
  },
  // Add more simulated rules here
];

// Simulate fetching new rules
export function fetchMarketplaceRules() {
  return marketplaceRules;
}

// Simulate automatic rule update
export function autoUpdateSiteRules() {
  const allRules = JSON.parse(localStorage.getItem('focusfix_site_rules') || '{}');
  marketplaceRules.forEach(entry => {
    if (!allRules[entry.domain]) {
      allRules[entry.domain] = entry.rules;
    }
  });
  localStorage.setItem('focusfix_site_rules', JSON.stringify(allRules));
}
