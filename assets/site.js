/* ================================================================
   Motion layer. Everything here is progressive enhancement: the
   page reads fine with JS off (no .js class, so reveals stay
   visible), and with prefers-reduced-motion every effect is off.
   ================================================================ */
(function(){
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  if(!reduceMotion) document.documentElement.classList.add('ok-motion');

  /* Refresh / direct-link correctness: the hero heights depend on the
     viewport and the photos load late, so the browser's initial hash
     anchor lands wrong. Once everything has loaded, re-anchor
     instantly; only then enable smooth scrolling for user clicks. */
  window.addEventListener('load', function(){
    if(location.hash){
      var target = document.querySelector(location.hash);
      if(target) target.scrollIntoView({behavior: 'instant', block: 'start'});
    }
    requestAnimationFrame(function(){
      document.documentElement.classList.add('smooth');
    });
  });

  /* ---------- Hero headline: split into rising words ---------- */
  var title = document.getElementById('hero-title');
  // Walk the headline's child nodes so it animates even when it carries
  // inline markup (the pricing page's two-tone <em> + <br>). Each word
  // becomes a rising span; the <em> wrapper and its colour are kept by
  // splitting INTO a clone of it, and <br> is preserved. wi runs across
  // the whole headline so the stagger is continuous. The old version
  // bailed on any child element, which left the pricing h1 static.
  if(title && !reduceMotion){
    var wi = 0;
    var splitInto = function(target, text){
      text.split(/(\s+)/).forEach(function(tok){
        if(tok === '') return;
        if(/^\s+$/.test(tok)){ target.appendChild(document.createTextNode(' ')); return; }
        var outer = document.createElement('span'); outer.className = 'w';
        var inner = document.createElement('i'); inner.textContent = tok;
        inner.style.setProperty('--d', (0.08 * wi++) + 's');
        outer.appendChild(inner);
        target.appendChild(outer);
      });
    };
    var nodes = Array.prototype.slice.call(title.childNodes);
    title.textContent = '';
    nodes.forEach(function(node){
      if(node.nodeType === 3){ splitInto(title, node.textContent); }
      else if(node.nodeType === 1 && node.tagName === 'BR'){ title.appendChild(document.createElement('br')); }
      else if(node.nodeType === 1){
        var clone = node.cloneNode(false);   // keep the tag (em) + its styling, drop the text
        splitInto(clone, node.textContent);
        title.appendChild(clone);
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  // Reveal a single element: fade/move it in (.in), then once it has SETTLED add
  // .sh, which returns its box-shadow. A shadow is held off during the reveal
  // because animating opacity/transform composites the element and the compositor
  // renders its soft shadow as a HARD offset copy for the length of the animation
  // (visible on scroll-down only, since reveals fire as elements enter view). By
  // the time .sh lands the card is static and de-composited, so the shadow is soft
  // and locked. 1300ms clears the slowest reveal variant + its data-delay.
  function reveal(el){
    var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
    setTimeout(function(){ el.classList.add('in'); }, delay);
    setTimeout(function(){ el.classList.add('sh'); }, delay + 1300);
  }
  if('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting) return;
        reveal(e.target);
        io.unobserve(e.target);
      });
    }, {threshold: 0.18, rootMargin: '0px 0px -40px 0px'});
    reveals.forEach(function(el){ io.observe(el); });
    // Belt-and-braces: the observer's INITIAL callback can fail to fire right
    // after navigation (it needs a paint/scroll), which left above-the-fold
    // reveals stuck at opacity:0 + transform on load. On the next frame, reveal
    // anything already in view; the observer handles the rest on scroll.
    requestAnimationFrame(function(){
      reveals.forEach(function(el){
        var r = el.getBoundingClientRect();
        if(r.top < (window.innerHeight * 0.92) && r.bottom > 0){
          reveal(el);
          io.unobserve(el);
        }
      });
    });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); el.classList.add('sh'); });
  }

  /* ---------- Count-up stat (the 8 million line) ---------- */
  var stats = document.querySelectorAll('[data-count]');
  if('IntersectionObserver' in window && !reduceMotion){
    var sio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting) return;
        var el = e.target, target = parseFloat(el.getAttribute('data-count')),
            suffix = el.getAttribute('data-suffix') || '', t0 = null;
        function tick(t){
          if(!t0) t0 = t;
          var p = Math.min((t - t0) / 1200, 1);
          // ease-out cubic so the number lands softly
          var v = target * (1 - Math.pow(1 - p, 3));
          el.textContent = (target % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suffix;
          if(p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        sio.unobserve(el);
      });
    }, {threshold: 0.6});
    stats.forEach(function(el){ sio.observe(el); });
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('burger');
  var navMobile = document.getElementById('nav-mobile');
  function closeMenu(){
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', function(){
    var open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  navMobile.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });

  /* ---------- Header is STATIC (no hide-on-scroll) ----------
     The header used to slide up on scroll-down and back in on scroll-up. Even
     with its drop shadow removed, a fixed bar that moves on scroll is the last
     thing changing on scroll site-wide, and it read as motion/a shadow sweeping
     over the content. It is now pinned and never moves: nothing about the header
     changes on scroll, so there is no scroll motion or shadow to catch the eye.
     (No scroll listener here on purpose.) */

  /* ---------- Scroll parallax (hero photo, why circle) ----------
     Elements with data-parallax shift by factor * distance-from-
     viewport-centre. rAF-throttled, transform only. */
  var plxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var plxTicking = false;
  function parallax(){
    plxTicking = false;
    // No scroll parallax on phones. The inline transform would promote
    // the hero photo to its own compositor layer, which mobile browsers
    // can paint OVER the following content (the "with nellie..." pill
    // showed then vanished behind the image on real phones), and it
    // would also shift the now in-flow stacked photo band. Clear any
    // transform so the CSS stack holds.
    if(window.innerWidth <= 760){
      plxEls.forEach(function(el){ if(el.style.transform) el.style.transform = ''; });
      return;
    }
    var vh = window.innerHeight;
    plxEls.forEach(function(el){
      var f = parseFloat(el.getAttribute('data-parallax'));
      var r = el.getBoundingClientRect();
      var mid = r.top + r.height / 2 - vh / 2;
      el.style.transform = 'translateY(' + (mid * -f).toFixed(1) + 'px)';
    });
  }
  if(!reduceMotion && plxEls.length){
    window.addEventListener('scroll', function(){
      if(!plxTicking){ plxTicking = true; requestAnimationFrame(parallax); }
    }, {passive: true});
    parallax();
  }

  /* ---------- Mouse parallax for the hero notes ----------
     Each note carries data-depth; deeper notes move more. Damped
     towards the target each frame so motion feels weighty rather
     than glued to the cursor. Skipped on touch devices. */
  var notes = Array.prototype.slice.call(document.querySelectorAll('.note'));
  var fine = window.matchMedia('(pointer: fine)').matches;
  var heroEl = document.getElementById('hero');
  if(!reduceMotion && fine && notes.length && heroEl){
    var tx = 0, ty = 0, cx = 0, cy = 0;
    var hero = heroEl;
    hero.addEventListener('mousemove', function(e){
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
    });
    (function loop(){
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      notes.forEach(function(n){
        var d = parseFloat(n.getAttribute('data-depth'));
        n.style.transform = 'translate3d(' + (-cx * d).toFixed(1) + 'px,' + (-cy * d).toFixed(1) + 'px,0)';
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Living notification chips ----------
     The hero chips cycle through little nellie moments with a soft
     flip: content swaps on the inner wrapper so it never fights the
     parallax transform on the chip itself. Pauses off-screen. */
  // the connect page tells the app side of the story
  var noteMoments = document.querySelector('.hiw-hero') ? [
    {emoji: '\uD83D\uDCF7', main: 'Sophie uploaded 3 photos', sub: 'to the family album'},
    {emoji: '\uD83D\uDD14', main: 'Reminder added: bingo', sub: 'Thursday afternoon'},
    {emoji: '\uD83D\uDC9C', main: 'Tommy sent a message', sub: 'just now'},
    {emoji: '\uD83D\uDC40', main: 'Nana viewed your post', sub: 'read 4 times'},
    {emoji: '\uD83C\uDFB5', main: 'Playlist updated', sub: 'Vera Lynn added'},
    {emoji: '\uD83D\uDCC5', main: 'Visit scheduled: Dave', sub: 'Saturday at 11:00'}
  ] : [
    {emoji: '\uD83D\uDCF7', main: 'New photo from Cheryl', sub: '2 minutes ago'},
    {emoji: '\uD83D\uDC9C', main: '\u201CHope you\u2019re having a lovely day, Nana x\u201D', sub: 'message from Emily'},
    {emoji: '\uD83D\uDD14', main: 'Dave dropping in at 12:00', sub: 'today\u2019s visits'},
    {emoji: '\uD83C\uDFB5', main: 'Nellie Radio: The Everly Brothers', sub: 'listening now'},
    {emoji: '\uD83D\uDDBC\uFE0F', main: 'Slideshow: the wedding day, 1952', sub: 'playing on nellie'},
    {emoji: '\uD83D\uDCEC', main: 'Zo\u00EB read your message', sub: 'viewed 4 times'}
  ];
  var noteEls = Array.prototype.slice.call(document.querySelectorAll('#hero .note'));
  if(!reduceMotion && noteEls.length){
    var nmIndex = noteEls.length;
    var nmSlot = 0;
    setInterval(function(){
      var heroBox = document.getElementById('hero').getBoundingClientRect();
      if(heroBox.bottom < 0 || heroBox.top > window.innerHeight) return;
      var el = noteEls[nmSlot];
      nmSlot = (nmSlot + 1) % noteEls.length;
      var m = noteMoments[nmIndex % noteMoments.length];
      nmIndex++;
      el.classList.add('swapping');
      setTimeout(function(){
        el.querySelector('.emoji').textContent = m.emoji;
        var span = el.querySelector('.note-inner > span:last-child');
        span.innerHTML = '';
        span.appendChild(document.createTextNode(m.main));
        var small = document.createElement('small');
        small.textContent = m.sub;
        span.appendChild(small);
        el.classList.remove('swapping');
      }, 380);
    }, 4200);
  }

  /* ---------- 3D tilt cards (steps) ---------- */
  if(!reduceMotion && fine){
    document.querySelectorAll('.tilt-card').forEach(function(card){
      var raf = null;
      card.addEventListener('mousemove', function(e){
        if(raf) return;
        raf = requestAnimationFrame(function(){
          raf = null;
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width;
          var py = (e.clientY - r.top) / r.height;
          card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 7).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 9).toFixed(2) + 'deg) translateY(-4px)';
        });
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  }

  /* ---------- Full-bleed key-features slider (6 slides) ----------
     Crossfade between stacked slides; the active one gets .on (which
     also triggers the caption rise and the slow image drift). Arrows,
     dots, swipe and arrow keys; gentle auto-advance that stops for
     good on the first manual interaction. */
  var slidesBox = document.getElementById('slides');
  if(slidesBox){
  var slides = Array.prototype.slice.call(slidesBox.querySelectorAll('.slide'));
  var dotsBox = document.getElementById('slider-dots');
  var sliderNav = dotsBox.parentElement;
  var N = slides.length, cur = 0, userTouched = false;
  sliderNav.classList.add('manual');
  // kept for API symmetry with the dots/arrows handlers
  function takeOver(){
    if(userTouched) return;
    userTouched = true;
    sliderNav.classList.remove('auto');
    sliderNav.classList.add('manual');
  }

  slides.forEach(function(s, i){
    var b = document.createElement('button');
    b.setAttribute('aria-label', 'Go to feature ' + (i + 1));
    b.addEventListener('click', function(){ takeOver(); go(i); });
    dotsBox.appendChild(b);
  });
  var dots = Array.prototype.slice.call(dotsBox.children);

  function go(i){
    cur = ((i % N) + N) % N;
    slides.forEach(function(s, j){
      s.classList.toggle('on', j === cur);
      s.setAttribute('aria-hidden', String(j !== cur));
    });
    dots.forEach(function(d, j){ d.classList.toggle('on', j === cur); });
  }

  document.getElementById('slider-prev').addEventListener('click', function(){ takeOver(); go(cur - 1); });
  document.getElementById('slider-next').addEventListener('click', function(){ takeOver(); go(cur + 1); });
  document.addEventListener('keydown', function(e){
    // only steer the slider while it's on screen
    var r = slidesBox.getBoundingClientRect();
    if(r.bottom < 0 || r.top > window.innerHeight) return;
    if(e.key === 'ArrowLeft'){ takeOver(); go(cur - 1); }
    if(e.key === 'ArrowRight'){ takeOver(); go(cur + 1); }
  });

  // touch swipe
  var sx = null;
  slidesBox.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive: true});
  slidesBox.addEventListener('touchend', function(e){
    if(sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if(Math.abs(dx) > 40){ takeOver(); go(cur + (dx < 0 ? 1 : -1)); }
    sx = null;
  }, {passive: true});

  // (carousel perspective/tilt hover removed per amends: the card stays flat)

  // carousel is manual only (no autoplay): the active dot shows as a
  // solid pill rather than a sweeping progress fill
  go(0);
  } // end slider guard

  /* ---------- FAQ accordion (pricing page) ----------
     One open at a time; the +/- glyph is CSS-driven off .open. */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var head = item.querySelector('.faq-q');
    if(!head) return;
    head.addEventListener('click', function(){
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(o){ o.classList.remove('open'); });
      if(!open) item.classList.add('open');
    });
  });
})();
