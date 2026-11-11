// Flat experience catalogue. Without JavaScript every card remains visible and
// category, location and time dropdowns progressively enhance the listings.
(function () {
  'use strict';
  var catalogue = document.querySelector('[data-experience-directory]');
  if (!catalogue) return;
  var cards = Array.from(catalogue.querySelectorAll('[data-experience]'));
  var category = catalogue.querySelector('[data-category-filter]');
  var location = catalogue.querySelector('[data-location-filter]');
  var time = catalogue.querySelector('[data-time-filter]');
  var results = catalogue.querySelector('[data-experience-results]');
  var empty = catalogue.querySelector('[data-experience-empty]');
  var filters = catalogue.querySelector('[data-catalogue-filters]');
  var toggle = catalogue.querySelector('[data-toggle-experiences]');
  var resetButtons = Array.from(catalogue.querySelectorAll('[data-clear-experiences]'));
  var quickCategories = catalogue.querySelector('[data-experience-quick-categories]');
  var categoryButtons = Array.from(catalogue.querySelectorAll('[data-experience-category]'));
  var validCategories = Array.from(category.options).map(function (o) { return o.value; });
  var validLocations = Array.from(location.options).map(function (o) { return o.value; });
  var validTimes = Array.from(time.options).map(function (o) { return o.value; });
  filters.hidden = true;
  toggle.hidden = false;
  toggle.setAttribute('aria-expanded', 'false');
  quickCategories.hidden = false;
  categoryButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      category.value = button.getAttribute('data-experience-category');
      render(); save();
    });
  });
  toggle.addEventListener('click',function () {
    filters.hidden = !filters.hidden;
    toggle.setAttribute('aria-expanded', filters.hidden ? 'false' : 'true');
  });
  filters.addEventListener('keydown',function (event) {
    if (event.key === 'Escape') {
      filters.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
    }
  });

  function render() {
    var count = 0;
    cards.forEach(function (card) {
      var show = (category.value === 'all' || card.getAttribute('data-category') === category.value) &&
        (location.value === 'all' || card.getAttribute('data-location') === location.value) &&
        (time.value === 'all' || card.getAttribute('data-time') === time.value);
      card.hidden = !show;
      if (show) count++;
    });
    results.textContent = count === cards.length ? count + ' experiences' : count + ' of ' + cards.length + ' experiences';
    empty.hidden = count !== 0;
    categoryButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-experience-category') === category.value ? 'true' : 'false');
    });
    var active = false;
    [location,time,category].forEach(function (control) {
      var selected = control.value !== 'all';
      control.setAttribute('data-active', selected ? 'true' : 'false');
      if (selected) active = true;
    });
    resetButtons.forEach(function (button) { button.hidden = !active; });
  }
  function save() {
    var url = new URL(window.location.href);
    [['group',category.value],['location',location.value],['time',time.value]].forEach(function (pair) {
      if (pair[1] === 'all') url.searchParams.delete(pair[0]);
      else url.searchParams.set(pair[0],pair[1]);
    });
    url.searchParams.delete('preference');
    url.hash = '';
    window.history.pushState(null, '', url.pathname + url.search);
  }
  function restore() {
    var params = new URLSearchParams(window.location.search);
    var requested = params.get('group');
    if (!requested && window.location.hash.indexOf('#group-') === 0) requested = window.location.hash.slice(7);
    category.value = validCategories.indexOf(requested) !== -1 ? requested : 'all';
    // Preserve previously shared country-filter links from the grouped directory.
    var requestedLocation = params.get('location') || params.get('preference');
    location.value = validLocations.indexOf(requestedLocation) !== -1 ? requestedLocation : 'all';
    var requestedTime = params.get('time');
    time.value = validTimes.indexOf(requestedTime) !== -1 ? requestedTime : 'all';
    render();
  }
  [location,time,category].forEach(function (control) { control.addEventListener('change',function () { render(); save(); }); });
  resetButtons.forEach(function (button) {
    button.addEventListener('click',function () {
      category.value = 'all'; location.value = 'all'; time.value = 'all'; render(); save();
      // Clearing also hides the reset button; keep focus on a visible control.
      if (filters.hidden) toggle.focus();
      else if (window.matchMedia('(min-width: 601px)').matches) category.focus();
      else location.focus();
    });
  });
  window.addEventListener('popstate',restore);
  restore();

  // Match the filter row's sticky offset to the actual shared header height.
  var header = document.querySelector('.site-header');
  if (header && typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(function () {
      catalogue.style.setProperty('--catalogue-header-height', Math.ceil(header.getBoundingClientRect().height) + 'px');
    }).observe(header);
  }
})();
