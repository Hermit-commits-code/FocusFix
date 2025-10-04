// Inject visible focus outlines and custom styles
export function injectFocusOutline(settings, diagnostics) {
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
  const focusableElements = document.querySelectorAll(
    "button, a, input, textarea, select, [tabindex]"
  );
  diagnostics.focusIssues = focusableElements.length;
}
