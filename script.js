/* ===== Corpo Leve 21D — interações ===== */
(function () {
  'use strict';

  // ano no rodapé
  var anoEl = document.getElementById('ano');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  // Nav com fundo ao rolar + CTA sticky
  var nav = document.getElementById('nav');
  var ctaSticky = document.getElementById('ctaSticky');
  var hero = document.getElementById('hero');
  // Barra de progresso de scroll (funciona com ou sem GSAP)
  var progressBar = document.getElementById('scrollProgress');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('scrolled', y > 30);
    if (ctaSticky) {
      var heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 600;
      ctaSticky.classList.toggle('show', y > heroBottom - 200);
    }
    if (progressBar) {
      var h = document.documentElement;
      var max = (h.scrollHeight - h.clientHeight) || 1;
      progressBar.style.width = (Math.min(y / max, 1) * 100) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // Accordion: fecha os outros ao abrir (experiência mais suave)
  var accs = document.querySelectorAll('.acc');
  accs.forEach(function (acc) {
    acc.addEventListener('toggle', function () {
      if (acc.open) {
        accs.forEach(function (o) { if (o !== acc) o.open = false; });
      }
    });
  });

  // Respeita prefers-reduced-motion e ausência de GSAP -> mostra tudo, sem animar
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';

  if (!hasGSAP || reduce) {
    // Fallback: garante que nada fique invisível
    document.body.classList.remove('gsap-on');
    return;
  }

  // A partir daqui, GSAP disponível e movimento permitido
  document.body.classList.add('gsap-on');
  gsap.registerPlugin(ScrollTrigger);

  var ease = 'power3.out';

  // ---- HERO: entrada encadeada ----
  var heroItems = gsap.utils.toArray('#hero [data-anim="fade"]');
  gsap.set(heroItems, { y: 26, opacity: 0 });
  gsap.to(heroItems, {
    y: 0, opacity: 1, duration: 0.9, ease: ease, stagger: 0.12, delay: 0.15
  });

  // ---- HERO: cards flutuantes entram + flutuam em loop sutil ----
  var floats = gsap.utils.toArray('[data-float]');
  gsap.set(floats, { opacity: 0, y: 40, scale: 0.96 });
  gsap.to(floats, {
    opacity: 1, y: 0, scale: 1, duration: 1, ease: ease, stagger: 0.14, delay: 0.4,
    onComplete: function () {
      floats.forEach(function (el, i) {
        gsap.to(el, {
          y: '+=12', duration: 3 + i * 0.4, ease: 'sine.inOut',
          repeat: -1, yoyo: true, delay: i * 0.2
        });
      });
    }
  });

  // ---- Folhas/blobs do fundo: deriva muito leve em loop ----
  gsap.utils.toArray('.leaf').forEach(function (el, i) {
    gsap.to(el, { y: '+=18', x: '+=8', rotation: 8, duration: 6 + i, ease: 'sine.inOut', repeat: -1, yoyo: true });
  });

  // ---- Reveal genérico ao entrar na viewport ----
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.fromTo(el, { y: 34, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.85, ease: ease,
      scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' }
    });
  });

  // ---- Cards de entregáveis: stagger por grade ----
  var cards = gsap.utils.toArray('[data-card]');
  if (cards.length) {
    gsap.fromTo(cards, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: ease, stagger: 0.1,
      scrollTrigger: { trigger: '.grid-entregaveis', start: 'top 80%' }
    });
  }

  // ---- Pilares: entram um a um + linha de progresso acompanha o scroll ----
  var pilares = gsap.utils.toArray('[data-pilar]');
  pilares.forEach(function (el, i) {
    gsap.fromTo(el, { y: 46, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: ease,
      scrollTrigger: { trigger: el, start: 'top 84%' }
    });
  });
  var progress = document.getElementById('pilarProgress');
  if (progress) {
    gsap.to(progress, {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: '.pilares', start: 'top 70%', end: 'bottom 70%', scrub: 0.6 }
    });
  }

  // ---- Oferta: leve "respiro" ao surgir ----
  var offer = document.querySelector('.offerbox');
  if (offer) {
    gsap.fromTo(offer, { y: 50, opacity: 0, scale: 0.97 }, {
      y: 0, opacity: 1, scale: 1, duration: 1, ease: ease,
      scrollTrigger: { trigger: offer, start: 'top 82%' }
    });
  }

  // ---- Parallax muito sutil nos blobs do fundo ----
  gsap.utils.toArray('.blob').forEach(function (el, i) {
    gsap.to(el, {
      yPercent: (i % 2 === 0 ? -12 : 12), ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 }
    });
  });

  // ---- Imagens: mockup com leve scale-in ----
  var mockup = document.querySelector('.mockup-showcase');
  if (mockup) {
    gsap.fromTo(mockup, { y: 40, opacity: 0, scale: 0.96 }, {
      y: 0, opacity: 1, scale: 1, duration: 1, ease: ease,
      scrollTrigger: { trigger: mockup, start: 'top 85%' }
    });
  }

  // ---- Imagens de seção e cartões de imagem: reveal suave ----
  gsap.utils.toArray('.section-visual, .image-card').forEach(function (el) {
    if (el.closest('#hero')) return; // hero já anima no bloco do hero
    gsap.fromTo(el, { y: 36, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: ease,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  // ---- Parallax muito sutil dentro das imagens largas ----
  gsap.utils.toArray('.section-visual .has-img, .mockup-showcase .has-img').forEach(function (img) {
    gsap.fromTo(img, { scale: 1.08 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  });

  // ---- Fundo: drift muito lento (vida sutil) ----
  var tex = document.querySelector('.bg-texture');
  if (tex) {
    gsap.to(tex, { yPercent: 6, xPercent: 2, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 2 } });
  }

  // ---- Preço do hero: pop suave ----
  var priceTag = document.querySelector('.price-tag');
  if (priceTag) {
    gsap.from(priceTag, { scale: 0.92, opacity: 0, duration: 0.7, ease: 'back.out(1.6)', delay: 0.5 });
  }

  // ---- Oferta: itens do "o que você recebe" em stagger ----
  var stackItems = gsap.utils.toArray('.value-stack li');
  if (stackItems.length) {
    gsap.from(stackItems, { x: -16, opacity: 0, duration: 0.5, ease: ease, stagger: 0.06,
      scrollTrigger: { trigger: '.value-stack', start: 'top 85%' } });
  }
  var sealItems = gsap.utils.toArray('.seals li');
  if (sealItems.length) {
    gsap.from(sealItems, { y: 12, opacity: 0, duration: 0.5, ease: ease, stagger: 0.08,
      scrollTrigger: { trigger: '.seals', start: 'top 92%' } });
  }

  // Recalcula posições após carregar fontes/imagens
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
