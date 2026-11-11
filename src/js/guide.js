/* Track reading position without changing browser history or moving focus. */
(function () {
 'use strict';
 var nav = document.querySelector('.guide-nav');
 if (!nav) return;
 var links = Array.from(nav.querySelectorAll('a[href^="#"]'));
 var sections = links.map(function (link) { return document.getElementById(link.getAttribute('href').slice(1)); });
 var header = document.querySelector('.site-header');
 var compact = window.matchMedia('(max-width:880px)');
 var current = -1, pending = false;
 function update() {
  pending = false;
  var headerHeight = header ? header.getBoundingClientRect().height : 76;
  var offset = headerHeight + (compact.matches ? nav.getBoundingClientRect().height : 0) + 24;
  document.documentElement.style.setProperty('--guide-header-height', headerHeight + 'px');
  document.documentElement.style.setProperty('--guide-scroll-offset', offset + 'px');
  var active = 0;
  sections.forEach(function (section, index) {
   if (section && section.getBoundingClientRect().top <= offset + 1) active = index;
  });
  if (active === current) return;
  current = active;
  links.forEach(function (link, index) {
   if (index === active) link.setAttribute('aria-current', 'location');
   else link.removeAttribute('aria-current');
  });
  if (compact.matches) {
   var link = links[active];
   nav.scrollTo({left:link.offsetLeft - nav.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2, behavior:'instant'});
  }
 }
 function schedule() {
  if (pending) return;
  pending = true; window.requestAnimationFrame(update);
 }
 window.addEventListener('scroll', schedule, {passive:true});
 window.addEventListener('resize', schedule);
 window.addEventListener('hashchange', schedule);
 if (typeof ResizeObserver !== 'undefined') {
  var observer = new ResizeObserver(schedule);
  if (header) observer.observe(header);
  observer.observe(nav);
 }
 update();
})();
