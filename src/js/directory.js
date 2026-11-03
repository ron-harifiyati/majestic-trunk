// Progressive enhancement: without JS, category links jump to visible sections.
(function () {
  'use strict';
  document.querySelectorAll('[data-directory]').forEach(function (directory) {
    var sections = Array.from(directory.querySelectorAll('[data-group]'));
    var links = Array.from(directory.querySelectorAll('[data-group-link]'));
    var cards = Array.from(directory.querySelectorAll('[data-card]'));
    var facet = directory.querySelector('[data-facet]');
    var filters = directory.querySelector('.directory-filters');
    var results = directory.querySelector('[data-results]');
    var empty = directory.querySelector('[data-empty]');
    var groups = links.map(function (a) { return a.getAttribute('data-group-link'); });
    var preferences = Array.from(facet.options).map(function (o) { return o.value; });
    var group = 'all';
    filters.hidden = false;

    function render() {
      var count = 0;
      sections.forEach(function (section) {
        var sectionCount = 0;
        var selected = group === 'all' || section.getAttribute('data-group') === group;
        section.querySelectorAll('[data-card]').forEach(function (card) {
          var tags = (card.getAttribute('data-tags') || '').split(/\s+/);
          var matches = selected && (facet.value === 'all' || tags.indexOf(facet.value) !== -1);
          card.hidden = !matches;
          if (matches) { count++; sectionCount++; }
        });
        section.hidden = sectionCount === 0;
      });
      links.forEach(function (link) {
        if (link.getAttribute('data-group-link') === group) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      results.textContent = 'Showing ' + count + ' of ' + cards.length + ' options';
      empty.hidden = count !== 0;
    }
    function save() {
      var url = new URL(window.location.href);
      if (group === 'all') url.searchParams.delete('group');
      else url.searchParams.set('group', group);
      if (facet.value === 'all') url.searchParams.delete('preference');
      else url.searchParams.set('preference', facet.value);
      url.hash = '';
      window.history.pushState(null, '', url.pathname + url.search);
    }
    function restore() {
      var params = new URLSearchParams(window.location.search);
      var requested = params.get('group');
      if (!requested && window.location.hash.indexOf('#group-') === 0) requested = window.location.hash.slice(7);
      group = groups.indexOf(requested) !== -1 ? requested : 'all';
      var preference = params.get('preference');
      facet.value = preferences.indexOf(preference) !== -1 ? preference : 'all';
      render();
    }
    links.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        group = link.getAttribute('data-group-link');
        render(); save();
      });
    });
    facet.addEventListener('change', function () { render(); save(); });
    directory.querySelectorAll('[data-reset]').forEach(function (button) {
      button.addEventListener('click', function () {
        group = 'all'; facet.value = 'all'; render(); save();
        // A reset inside an empty state must not leave focus in a hidden element.
        if (empty.contains(button)) links[0].focus();
      });
    });
    window.addEventListener('popstate', restore);
    restore();
  });
})();
