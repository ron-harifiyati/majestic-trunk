// Flat accommodation catalogue; all properties remain visible without JavaScript.
(function () {
  'use strict';
  var catalogue = document.querySelector('[data-stay-directory]');
  if (!catalogue) return;
  var cards = Array.from(catalogue.querySelectorAll('[data-stay]'));
  var controls = ['setting','type','preference'].map(function (name) {
    return {name:name, element:catalogue.querySelector('[data-' + name + '-filter]')};
  });
  var filters = catalogue.querySelector('[data-catalogue-filters]');
  var toggle = catalogue.querySelector('[data-toggle-stays]');
  var results = catalogue.querySelector('[data-stay-results]');
  var empty = catalogue.querySelector('[data-stay-empty]');
  var resets = Array.from(catalogue.querySelectorAll('[data-clear-stays]'));
  function close() {
    filters.hidden = true;
    toggle.setAttribute('aria-expanded','false');
  }
  close(); toggle.hidden = false;
  toggle.addEventListener('click',function () {
    filters.hidden = !filters.hidden;
    toggle.setAttribute('aria-expanded',filters.hidden ? 'false' : 'true');
  });
  filters.addEventListener('keydown',function (event) {
    if (event.key === 'Escape') { close(); toggle.focus(); }
  });
  function render() {
    var count = 0;
    cards.forEach(function (card) {
      var show = controls.every(function (control) {
        var value = control.element.value;
        if (value === 'all') return true;
        if (control.name === 'preference') return (card.getAttribute('data-tags') || '').split(/\s+/).indexOf(value) !== -1;
        return card.getAttribute('data-' + control.name) === value;
      });
      card.hidden = !show; if (show) count++;
    });
    results.textContent = count === cards.length ? count + ' places to stay' : count + ' of ' + cards.length + ' places to stay';
    empty.hidden = count !== 0;
    var active = controls.some(function (control) { return control.element.value !== 'all'; });
    resets.forEach(function (button) { button.hidden = !active; });
  }
  function save() {
    var url = new URL(window.location.href);
    controls.forEach(function (control) {
      var key = control.name === 'setting' ? 'group' : control.name;
      if (control.element.value === 'all') url.searchParams.delete(key);
      else url.searchParams.set(key,control.element.value);
    });
    url.hash = '';
    window.history.pushState(null,'',url.pathname + url.search);
  }
  function restore() {
    var params = new URLSearchParams(window.location.search);
    controls.forEach(function (control) {
      var requested = params.get(control.name === 'setting' ? 'group' : control.name);
      if (!requested && control.name === 'setting' && window.location.hash.indexOf('#group-') === 0) requested = window.location.hash.slice(7);
      var allowed = Array.from(control.element.options).map(function (option) { return option.value; });
      control.element.value = allowed.indexOf(requested) !== -1 ? requested : 'all';
    });
    render();
  }
  controls.forEach(function (control) {
    control.element.addEventListener('change',function () { render(); save(); });
  });
  resets.forEach(function (button) {
    button.addEventListener('click',function () {
      controls.forEach(function (control) { control.element.value = 'all'; });
      render(); save();
      if (filters.hidden) toggle.focus(); else controls[0].element.focus();
    });
  });
  window.addEventListener('popstate',restore); restore();
  var header = document.querySelector('.site-header');
  if (header && typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(function () {
      catalogue.style.setProperty('--catalogue-header-height',Math.ceil(header.getBoundingClientRect().height) + 'px');
    }).observe(header);
  }
})();
