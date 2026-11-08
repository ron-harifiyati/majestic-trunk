// Navigation remains available when JavaScript is disabled.
(function () {
  var btn = document.querySelector('.nav-toggle');
  var bar = document.querySelector('.navbar');
  if (!btn || !bar) return;
  btn.hidden = false;
  bar.classList.add('nav-ready');
  function closeMenu() {
    bar.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  btn.addEventListener('click', function () {
    var open = bar.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  bar.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && bar.classList.contains('open')) {
      closeMenu();
      btn.focus();
    }
  });
  bar.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('click', function (event) {
    if (!bar.contains(event.target)) closeMenu();
  });
})();
