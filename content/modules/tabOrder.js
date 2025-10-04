// Repair tabindex order in navbars/forms and provide tab order overlay
export function repairTabindexOrder(diagnostics) {
  let tabindexIssues = 0;
  const navs = document.querySelectorAll(
    'nav, [role="navigation"], [role="main"], [role="banner"], [role="complementary"], [role="contentinfo"], .nav, .navbar, .menu'
  );
  navs.forEach((nav) => {
    const focusableElements = nav.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"], [role="textbox"], [role="searchbox"]'
    );
    let tabOrder = [];
    focusableElements.forEach((el, index) => {
      const currentTabindex = parseInt(el.getAttribute("tabindex") || "0");
      if (currentTabindex > 0 || el.getAttribute("tabindex") === null) {
        el.setAttribute("tabindex", "0");
        tabindexIssues++;
      }
      tabOrder.push(el);
    });
    nav._focusfixTabOrder = tabOrder;
  });
  const forms = document.querySelectorAll("form, [role='form']");
  forms.forEach((form) => {
    const formElements = form.querySelectorAll(
      'input, textarea, select, button, [tabindex]:not([tabindex="-1"]), [role="button"], [role="textbox"]'
    );
    let tabIndex = 1;
    let tabOrder = [];
    formElements.forEach((el) => {
      const currentTabindex = parseInt(el.getAttribute("tabindex") || "0");
      if (currentTabindex <= 0 || currentTabindex > formElements.length) {
        el.setAttribute("tabindex", tabIndex.toString());
        tabIndex++;
        tabindexIssues++;
      }
      tabOrder.push(el);
    });
    form._focusfixTabOrder = tabOrder;
  });
  const highTabindexElements = document.querySelectorAll(
    '[tabindex]:not([tabindex="0"]):not([tabindex="-1"] )'
  );
  highTabindexElements.forEach((el) => {
    const tabindex = parseInt(el.getAttribute("tabindex"));
    if (tabindex > 0) {
      if (!el.closest("form") && !el.closest("nav, [role='navigation'], [role='main'], [role='banner'], [role='complementary'], [role='contentinfo']")) {
        el.setAttribute("tabindex", "0");
        tabindexIssues++;
      }
    }
  });
  diagnostics.tabindexIssues = tabindexIssues;
}
