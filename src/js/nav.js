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
  var enquiryField = document.getElementById('enquiry-interest');
  var enquiryLink = document.getElementById('email-enquiry');
  if (enquiryField && enquiryLink) {
    var interest = new URLSearchParams(window.location.search).get('interest');
    if (interest) {
      enquiryField.textContent = interest.slice(0, 160);
      enquiryField.hidden = false;
      enquiryLink.href = 'mailto:hello@majestictrunk.com?subject=' + encodeURIComponent('Enquiry: ' + interest.slice(0, 160));
    }
  }
})();
