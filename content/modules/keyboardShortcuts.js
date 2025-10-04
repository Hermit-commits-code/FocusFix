// Keyboard shortcuts for navigation and toggling features
export function registerKeyboardShortcuts(features) {
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
}
