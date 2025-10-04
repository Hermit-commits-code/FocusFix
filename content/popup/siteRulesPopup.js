// FocusFix Site Rules Popup UI
// UI for managing site-specific rules, import/export, marketplace, and auto-updates
import {
  getCurrentSiteRules,
  setCurrentSiteRules,
  applySiteRules,
  exportRules,
  importRules,
} from '../siteRules/siteRulesEngine.js';
import { fetchMarketplaceRules, autoUpdateSiteRules } from '../siteRules/marketplace.js';

// Render popup UI
export function renderSiteRulesPopup(container) {
  container.innerHTML = '';
  const domain = window.location.hostname;
  const rules = getCurrentSiteRules();

  // Title
  const title = document.createElement('h2');
  title.textContent = `Site Rules for ${domain}`;
  container.appendChild(title);

  // Focus Style Input
  const focusStyleLabel = document.createElement('label');
  focusStyleLabel.textContent = 'Focus Style (CSS outline):';
  const focusStyleInput = document.createElement('input');
  focusStyleInput.type = 'text';
  focusStyleInput.value = rules.focusStyle || '';
  focusStyleInput.placeholder = 'e.g. 2px solid #1976d2';
  focusStyleInput.onchange = () => {
    rules.focusStyle = focusStyleInput.value;
    setCurrentSiteRules(rules);
    applySiteRules(rules);
  };
  container.appendChild(focusStyleLabel);
  container.appendChild(focusStyleInput);

  // Import/Export Buttons
  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'Export All Rules';
  exportBtn.onclick = () => {
    const data = exportRules();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'focusfix_site_rules.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  container.appendChild(exportBtn);

  const importBtn = document.createElement('button');
  importBtn.textContent = 'Import Rules';
  importBtn.onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (importRules(reader.result)) {
          alert('Rules imported successfully!');
        } else {
          alert('Failed to import rules.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };
  container.appendChild(importBtn);

  // Marketplace Section
  const marketTitle = document.createElement('h3');
  marketTitle.textContent = 'Rule Marketplace (Local Simulation)';
  container.appendChild(marketTitle);

  const marketList = document.createElement('ul');
  fetchMarketplaceRules().forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${entry.domain}</strong>: ${entry.description} <em>by ${entry.contributor}</em>`;
    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Apply to My Rules';
    applyBtn.onclick = () => {
      setCurrentSiteRules(entry.rules);
      applySiteRules(entry.rules);
      alert('Marketplace rule applied!');
    };
    li.appendChild(applyBtn);
    marketList.appendChild(li);
  });
  container.appendChild(marketList);

  // Auto-update Button
  const autoUpdateBtn = document.createElement('button');
  autoUpdateBtn.textContent = 'Auto-Update All Rules';
  autoUpdateBtn.onclick = () => {
    autoUpdateSiteRules();
    alert('Marketplace rules auto-updated!');
  };
  container.appendChild(autoUpdateBtn);
}
