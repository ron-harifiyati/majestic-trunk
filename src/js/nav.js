// Mobile nav toggle — the only client-side JS the layout needs.
(function () {
  var btn = document.querySelector('.nav-toggle');
  var bar = document.querySelector('.navbar');
  if (!btn || !bar) return;
  btn.addEventListener('click', function () {
    var open = bar.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
