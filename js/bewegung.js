// Kita-Stadtelternrat Soltau: alles, was sich bewegt.
// Ohne Bibliotheken, damit die Seite auf GitHub Pages ohne Bauschritt läuft.
(function () {
  'use strict';

  var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var feineMaus = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var kopf = document.querySelector('.kopf');
  var lesen = document.querySelector('.lesefortschritt');

  // ── Kopfzeile schrumpft, der Farbstreifen füllt sich beim Scrollen ──
  var wartet = false;
  function scrollen() {
    wartet = false;
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var anteil = max > 0 ? Math.min(1, y / max) : 0;
    if (kopf) {
      kopf.classList.toggle('gescrollt', y > 20);
      kopf.style.setProperty('--fortschritt', anteil.toFixed(4));
    }
    if (lesen) lesen.style.setProperty('--fortschritt', anteil.toFixed(4));
  }
  window.addEventListener('scroll', function () {
    if (!wartet) { wartet = true; requestAnimationFrame(scrollen); }
  }, { passive: true });
  scrollen();

  // ── Menü auf dem Handy ──
  var menueKnopf = document.querySelector('.menue-knopf');
  function menue(offen) {
    document.body.classList.toggle('menue-offen', offen);
    if (menueKnopf) {
      menueKnopf.setAttribute('aria-expanded', String(offen));
      menueKnopf.setAttribute('aria-label', offen ? 'Menü schließen' : 'Menü öffnen');
    }
  }
  if (menueKnopf) {
    menueKnopf.addEventListener('click', function () {
      menue(!document.body.classList.contains('menue-offen'));
    });
    document.querySelectorAll('.navi a').forEach(function (a) {
      a.addEventListener('click', function () { menue(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') menue(false);
    });
  }

  // ── Dinge erscheinen, wenn sie ins Bild kommen ──
  var beobachter = 'IntersectionObserver' in window ? new IntersectionObserver(function (eintraege) {
    eintraege.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('da');
      if (e.target.hasAttribute('data-zaehlen')) zaehlen(e.target);
      e.target.querySelectorAll('[data-zaehlen]').forEach(zaehlen);
      beobachter.unobserve(e.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }) : null;

  document.querySelectorAll('.zeigen, .treppe, .bahn, .zahlen-raster, .thema').forEach(function (el) {
    if (beobachter) beobachter.observe(el); else el.classList.add('da');
  });

  // Zahlen zählen hoch, einmal
  function zaehlen(el) {
    if (el.dataset.gezaehlt) return;
    el.dataset.gezaehlt = '1';
    var ziel = parseInt(el.getAttribute('data-zaehlen'), 10);
    if (ruhig) { el.textContent = ziel; return; }
    var dauer = 1800, start = null;
    function schritt(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / dauer);
      el.textContent = Math.round(ziel * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(schritt);
    }
    requestAnimationFrame(schritt);
  }

  // ── Die Stifte im Startbild folgen der Maus ──
  var held = document.querySelector('.held');
  var heldBild = document.querySelector('.held-bild');
  if (held && heldBild && feineMaus && !ruhig) {
    held.addEventListener('pointermove', function (e) {
      var r = held.getBoundingClientRect();
      heldBild.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
      heldBild.style.setProperty('--my', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
    });
    held.addEventListener('pointerleave', function () {
      heldBild.style.setProperty('--mx', 0);
      heldBild.style.setProperty('--my', 0);
    });
  }

  // ── Karten kippen leicht zur Maus, Knöpfe ziehen sich an ──
  if (feineMaus && !ruhig) {
    document.querySelectorAll('.drei-karte').forEach(function (k) {
      k.addEventListener('pointermove', function (e) {
        var r = k.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        k.style.transform = 'perspective(900px) rotateX(' + (-y * 8).toFixed(2) + 'deg) rotateY(' + (x * 10).toFixed(2) + 'deg) translateY(-4px)';
      });
      k.addEventListener('pointerleave', function () { k.style.transform = ''; });
    });
    document.querySelectorAll('.knopf').forEach(function (k) {
      k.addEventListener('pointermove', function (e) {
        var r = k.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.18;
        var y = (e.clientY - r.top - r.height / 2) * 0.3;
        k.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      k.addEventListener('pointerleave', function () { k.style.transform = ''; });
    });
  }

  // ── Wie viele Tage noch bis zum nächsten Termin ──
  document.querySelectorAll('[data-termin]').forEach(function (el) {
    var t = el.getAttribute('data-termin').split('-');
    var termin = new Date(+t[0], +t[1] - 1, +t[2]);
    var heute = new Date();
    heute.setHours(0, 0, 0, 0);
    var tage = Math.round((termin - heute) / 86400000);
    var zahl = el.querySelector('b'), wort = el.querySelector('span');
    if (tage < 0) { el.hidden = true; return; }
    if (tage === 0) { zahl.textContent = 'Heute'; wort.textContent = ''; return; }
    zahl.setAttribute('data-zaehlen', tage);
    zahl.textContent = ruhig ? tage : '0';
    wort.textContent = tage === 1 ? 'Tag noch' : 'Tage noch';
    if (beobachter) beobachter.observe(zahl); else zahl.textContent = tage;
  });

  // ── E-Mail-Adresse kopieren ──
  document.querySelectorAll('[data-kopieren]').forEach(function (knopf) {
    var text = knopf.querySelector('span');
    var vorher = text.textContent;
    knopf.addEventListener('click', function () {
      var wert = knopf.getAttribute('data-kopieren');
      function fertig() {
        knopf.classList.add('ok');
        text.textContent = 'Kopiert!';
        setTimeout(function () { knopf.classList.remove('ok'); text.textContent = vorher; }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(wert).then(fertig, function () { markieren(wert); });
      } else {
        markieren(wert);
      }
    });
  });
  function markieren(wert) {
    var feld = document.querySelector('.post');
    if (!feld) return;
    var bereich = document.createRange();
    bereich.selectNodeContents(feld);
    var auswahl = window.getSelection();
    auswahl.removeAllRanges();
    auswahl.addRange(bereich);
  }

  // ── Kita-Suche: die Liste filtert sich beim Tippen ──
  var kitaFeld = document.getElementById('kita-feld');
  if (kitaFeld) {
    var kitas = [].slice.call(document.querySelectorAll('.kita'));
    var kitaLeer = document.querySelector('.kita-leer');
    var kitaTreffer = document.querySelector('.kita-treffer');
    // „Bärenstark“ findet man auch mit „baerenstark“, Satzzeichen zählen nicht
    var einfach = function (s) {
      return s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9@]+/g, ' ').trim();
    };
    kitas.forEach(function (k) { k.suchtext = einfach(k.getAttribute('data-suche') + ' ' + k.textContent); });
    kitaFeld.addEventListener('input', function () {
      var woerter = einfach(kitaFeld.value).split(' ').filter(Boolean);
      var gefunden = kitas.filter(function (k) {
        var passt = woerter.every(function (w) { return k.suchtext.indexOf(w) !== -1; });
        k.parentNode.hidden = !passt;
        if (!woerter.length) k.open = false;
        return passt;
      });
      // Bleibt genau eine Kita übrig, gleich mit Telefon und E-Mail zeigen
      if (woerter.length && gefunden.length === 1) gefunden[0].open = true;
      kitaLeer.hidden = gefunden.length > 0;
      kitaTreffer.textContent = woerter.length ? gefunden.length + (gefunden.length === 1 ? ' Kita' : ' Kitas') : '';
    });
  }

  // ── Im Menü steht unterstrichen, wo man gerade ist ──
  var links = {};
  document.querySelectorAll('.navi a[href^="#"]').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  if ('IntersectionObserver' in window && Object.keys(links).length) {
    var wo = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        var a = links[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) {
      var abschnitt = document.getElementById(id);
      if (abschnitt) wo.observe(abschnitt);
    });
  }
})();
