// Highlight navigation groups/containers as users tab through
export function registerFocusContextHighlighting() {
  let lastContext = null;
  function highlightContext(el) {
    if (lastContext) {
      lastContext.classList.remove('focusfix-context-highlight');
    }
    const context = el.closest('nav, section, aside, main, [role="navigation"], [role="main"], [role="region"], [role="banner"], [role="complementary"]');
    if (context) {
      context.classList.add('focusfix-context-highlight');
      lastContext = context;
    }
  }
  if (!document.getElementById('focusfix-context-style')) {
    const style = document.createElement('style');
    style.id = 'focusfix-context-style';
    style.textContent = `.focusfix-context-highlight {
      box-shadow: 0 0 0 4px #ffeb3b88, 0 0 12px 2px #1976d2;
      transition: box-shadow 0.2s;
    }`;
    document.head.appendChild(style);
  }
  document.addEventListener('focusin', (e) => {
    highlightContext(e.target);
  });
  document.addEventListener('focusout', () => {
    if (lastContext) lastContext.classList.remove('focusfix-context-highlight');
    lastContext = null;
  });
}
