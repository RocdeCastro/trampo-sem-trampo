/* Trampo sem Trampo · animação da extensão e formulário da lista */
(function () {
  'use strict';

  /* ---------- Animação: cursor preenchendo a candidatura ---------- */
  var form = document.getElementById('tst-form');
  if (form) {
    var boxes = Array.prototype.slice.call(form.querySelectorAll('[data-field]'));
    var cursor = document.getElementById('tst-cursor');
    var bubble = document.getElementById('tst-bubble');
    var sendBtn = document.getElementById('tst-send');
    var count = document.getElementById('tst-count');
    var bar = document.getElementById('tst-bar');
    var statusEl = document.getElementById('tst-status');
    var checks = Array.prototype.slice.call(document.querySelectorAll('[data-check]'));

    var SCRIPT = [
      { kind: 'type', label: 'Nome completo', text: 'Ana Souza', dx: 158 },
      { kind: 'type', label: 'Experiência mais recente', text: 'Head de Produto · fintech · 2022–hoje', dx: 193 },
      { kind: 'type', label: 'Currículo', text: 'CV · Head de Produto IA · PT.pdf', dx: 138, fast: true },
      { kind: 'type', label: 'Por que esta vaga?', text: 'Levei IA generativa do piloto à escala no atendimento.', dx: 213 },
      { kind: 'flag', label: 'Pretensão salarial', dx: 168 },
      { kind: 'button', label: 'Enviar', dx: 88 }
    ];
    var LAST = SCRIPT.length - 1;

    var state = { step: LAST, phase: 'hold', typed: 0 };
    var timer = null;
    var running = false;

    var reduced = false;
    try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

    function cursorTarget(step) {
      var base = form.getBoundingClientRect();
      var el = step < LAST ? boxes[step] : sendBtn;
      var r = el.getBoundingClientRect();
      var dx = Math.min(SCRIPT[step].dx, Math.max(24, r.width - 40));
      return { left: r.left - base.left + dx, top: r.top - base.top + (step < LAST ? 14 : 18) };
    }

    function render() {
      var step = state.step, phase = state.phase, typed = state.typed;

      for (var i = 0; i < 4; i++) {
        var full = SCRIPT[i].text;
        var txt = i < step ? full : (i === step && phase === 'type' ? full.slice(0, typed) : '');
        var box = boxes[i];
        var active = i === step && (phase === 'click' || phase === 'type');
        box.querySelector('[data-text]').textContent = txt;
        box.classList.toggle('is-filled', txt.length > 0);
        box.classList.toggle('is-active', active);
        var caret = box.querySelector('.tst-caret');
        if (active && phase === 'type') {
          if (!caret) { caret = document.createElement('span'); caret.className = 'tst-caret'; box.appendChild(caret); }
        } else if (caret) { caret.remove(); }
      }
      boxes[4].classList.toggle('is-active', step === 4 && phase !== 'move');

      var p = cursorTarget(step);
      cursor.style.left = p.left + 'px';
      cursor.style.top = p.top + 'px';

      var old = cursor.querySelector('.tst-ping');
      if (phase === 'click' && !old) {
        var ping = document.createElement('span');
        ping.className = 'tst-ping';
        cursor.insertBefore(ping, cursor.firstChild);
      } else if (phase !== 'click' && old) { old.remove(); }

      var showBubble = step >= 4 && (phase === 'click' || phase === 'hold');
      bubble.hidden = !showBubble;
      bubble.textContent = step === 4 ? 'Essa é com você' : 'Só você aperta aqui';

      var filled = 10 + Math.min(step, 4);
      count.textContent = filled;
      bar.style.width = Math.round(filled / 15 * 100) + '%';

      checks.forEach(function (c, i) {
        var mark = c.querySelector('[data-mark]');
        if (i < 4) {
          var done = i < step;
          c.classList.toggle('is-done', done);
          mark.textContent = done ? '✓' : '○';
        } else {
          var yours = step >= 4;
          c.classList.toggle('is-yours', yours);
          mark.textContent = yours ? '●' : '○';
          c.querySelector('[data-label]').textContent = yours ? 'Pretensão: com você' : 'Pretensão salarial';
        }
      });

      var s = SCRIPT[step];
      statusEl.textContent = step < 4
        ? (phase === 'move' ? 'Indo para: ' : 'Preenchendo: ') + s.label
        : step === 4 ? 'Pretensão salarial fica com você.' : 'Pronto. Confira e envie.';
    }

    function tick() {
      var step = state.step, phase = state.phase, typed = state.typed;
      var s = SCRIPT[step];
      var next;
      if (phase === 'move') {
        state.phase = 'click'; next = 280;
      } else if (phase === 'click') {
        if (s.kind === 'type') { state.phase = 'type'; state.typed = 0; next = 60; }
        else { state.phase = 'hold'; next = s.kind === 'flag' ? 1500 : 2800; }
      } else if (phase === 'type') {
        if (typed < s.text.length) {
          state.typed = s.fast ? s.text.length : typed + 1;
          next = s.fast ? 450 : 38;
        } else {
          state.step = step + 1; state.phase = 'move'; state.typed = 0; next = 720;
        }
      } else {
        if (step < LAST) { state.step = step + 1; state.phase = 'move'; next = 720; }
        else { state.step = 0; state.phase = 'move'; state.typed = 0; next = 1000; }
      }
      render();
      timer = setTimeout(tick, next);
    }

    function start() {
      if (running || reduced) return;
      running = true;
      state = { step: 0, phase: 'move', typed: 0 };
      render();
      timer = setTimeout(tick, 900);
    }
    function stop() {
      running = false;
      clearTimeout(timer);
    }

    render();
    window.addEventListener('resize', render);

    if (!reduced) {
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) start(); else stop(); });
        }, { threshold: 0.35 }).observe(form);
      } else {
        start();
      }
    }
  }

  /* ---------- Lista de espera (ainda sem integração) ---------- */
  var lista = document.getElementById('form-lista');
  if (lista) {
    lista.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var msg = document.getElementById('lista-msg');
      msg.textContent = 'Valeu! A lista ainda não está aberta: por enquanto este site é um protótipo e nenhum e-mail foi guardado.';
    });
  }
})();
