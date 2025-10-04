// Add skip navigation links if missing
export function addSkipToContent(diagnostics) {
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
      if (window.focusfixAlwaysShowSkipLinks) {
        skipLink.style.transform = "translateY(0)";
      }
      if (!document.getElementById(target.id)) {
        const anchor = document.createElement("div");
        anchor.id = target.id;
        anchor.tabIndex = -1;
        document.body.appendChild(anchor);
      }
    }
  });
}
