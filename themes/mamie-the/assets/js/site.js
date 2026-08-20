/* Mamie-Thé — menu mobile, recherche, filtres du guide d'infusion */
(function () {
  'use strict';

  /* Menu mobile */
  var burger = document.getElementById('burger'),
      navm = document.getElementById('nav-mobile');
  if (burger && navm) {
    burger.addEventListener('click', function () {
      var open = navm.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  /* Recherche côté client, sur l'index JSON généré par Hugo */
  var modal = document.getElementById('search-modal'),
      input = document.getElementById('search-input'),
      out = document.getElementById('search-results'),
      idx = null;

  function openSearch(e) {
    if (e) e.preventDefault();
    if (!modal) return;
    modal.classList.add('open');
    input.focus();
    if (!idx) {
      fetch(document.documentElement.dataset.searchIndex || '/index.json')
        .then(function (r) { return r.json(); })
        .then(function (d) { idx = d; })
        .catch(function () { idx = []; });
    }
  }
  function closeSearch() { if (modal) modal.classList.remove('open'); }

  ['open-search', 'open-search-m'].forEach(function (id) {
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', openSearch);
  });
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal) closeSearch(); });
  }
  var closeBtn = document.getElementById('close-search');
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  if (input) {
    input.addEventListener('input', function () {
      var q = norm(input.value.trim());
      if (q.length < 2) { out.innerHTML = '<p class="search-empty">Tapez au moins deux lettres.</p>'; return; }
      if (!idx) { out.innerHTML = '<p class="search-empty">Chargement…</p>'; return; }
      var scored = [];
      idx.forEach(function (p) {
        var t = norm(p.title), d = norm(p.description), g = norm(p.tags), b = norm(p.body || '');
        var s = 0;
        if (t.indexOf(q) > -1) s += 10;
        if (g.indexOf(q) > -1) s += 5;
        if (d.indexOf(q) > -1) s += 3;
        if (b.indexOf(q) > -1) s += 1;
        if (s) scored.push({p: p, s: s});
      });
      scored.sort(function (a, b) { return b.s - a.s; });
      var hits = scored.slice(0, 8).map(function (x) { return x.p; });
      if (!hits.length) { out.innerHTML = '<p class="search-empty">Aucun résultat pour « ' + input.value + ' ».</p>'; return; }
      out.innerHTML = hits.map(function (p) {
        return '<a href="' + p.url + '"><span class="t">' + p.title + '</span><span class="d">' + (p.description || '') + '</span></a>';
      }).join('');
    });
  }

  /* Filtres du guide d'infusion */
  var fbtns = document.querySelectorAll('.filter-btn');
  if (fbtns.length) {
    fbtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.dataset.filter;
        fbtns.forEach(function (x) { x.classList.toggle('on', x === b); });
        document.querySelectorAll('.inf-card').forEach(function (c) {
          c.hidden = !(f === 'tous' || c.dataset.famille === f);
        });
      });
    });
  }
})();
