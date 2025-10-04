// Smart focus management: modal trapping, restoration, logical flow, group navigation
export function registerSmartFocusManagement() {
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
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
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
}
