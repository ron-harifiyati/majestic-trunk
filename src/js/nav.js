// Navigation remains available when JavaScript is disabled.
(function () {
  var btn = document.querySelector('.nav-toggle');
  var bar = document.querySelector('.navbar');
  var panel = document.querySelector('.nav-panel');
  var backdrop = document.querySelector('.nav-backdrop');
  var close = document.querySelector('.nav-close');
  if (!btn || !bar || !panel || !backdrop || !close) return;
  var mobile = window.matchMedia('(max-width:1180px), (max-width:1366px) and (pointer:coarse)');
  var open = false;
  var overflow = '';
  var background = [];
  btn.hidden = false;
  bar.classList.add('nav-ready');
  function closeMenu(restoreFocus) {
    if (!open) return;
    open = false;
    bar.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open navigation menu');
    panel.removeAttribute('role');
    panel.removeAttribute('aria-modal');
    panel.removeAttribute('aria-labelledby');
    backdrop.hidden = true;
    document.body.style.overflow = overflow;
    background.forEach(function (item) { item.element.inert = item.inert; });
    background = [];
    if (restoreFocus) btn.focus();
  }
  function openMenu() {
    if (!mobile.matches) return;
    open = true;
    overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    background = Array.from(document.querySelectorAll('main, .site-footer, .brand')).map(function (element) {
      var state = {element:element, inert:element.inert};
      element.inert = true;
      return state;
    });
    panel.style.top = (bar.getBoundingClientRect().bottom + 12) + 'px';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'mobile-navigation-title');
    bar.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close navigation menu');
    backdrop.hidden = false;
    close.focus();
  }
  btn.addEventListener('click', function () { if (open) closeMenu(true); else openMenu(); });
  close.addEventListener('click', function () { closeMenu(true); });
  backdrop.addEventListener('click', function () { closeMenu(true); });
  document.addEventListener('keydown', function (event) {
    if (!open) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); return; }
    if (event.key === 'Tab') {
      var items = Array.from(panel.querySelectorAll('a[href], button:not([disabled])'));
      var first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    }
  });
  panel.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { closeMenu(false); });
  });
  document.addEventListener('click', function (event) {
    if (open && !bar.contains(event.target)) closeMenu(true);
  });
  mobile.addEventListener('change', function () { closeMenu(false); });
})();
