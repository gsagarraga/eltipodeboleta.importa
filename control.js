/* =========================================================
   Control remoto desde el celular para presentar.html
   Uso: agregar antes de </body>
        <script src="control.js"></script>
   En la compu: apretá Q para mostrar/ocultar el código QR.
   En el celu: escaneá el QR y usá los botones ← →.
   ========================================================= */
(function () {
  const PEERJS = 'https://cdn.jsdelivr.net/npm/peerjs@1.5.5/dist/peerjs.min.js';
  const QRLIB  = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js';

  const TECLAS = {
    next:  { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
    prev:  { key: 'ArrowLeft',  code: 'ArrowLeft',  keyCode: 37 },
    first: { key: 'Home',       code: 'Home',       keyCode: 36 },
    last:  { key: 'End',        code: 'End',        keyCode: 35 }
  };

  function cargar(src) {
    return new Promise((ok, mal) => {
      const s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = mal;
      document.head.appendChild(s);
    });
  }

  // Simula la tecla, así funciona con la navegación que ya tiene la presentación
  function apretar(accion) {
    const t = TECLAS[accion];
    if (!t) return;
    ['keydown', 'keyup'].forEach(tipo => {
      const ev = new KeyboardEvent(tipo, { key: t.key, code: t.code, bubbles: true, cancelable: true });
      Object.defineProperty(ev, 'keyCode', { get: () => t.keyCode });
      Object.defineProperty(ev, 'which',   { get: () => t.keyCode });
      (document.activeElement || document.body).dispatchEvent(ev);
    });
  }

  // ---------- Qué diapositiva se está viendo ----------
  const limpiar = t => (t || '').replace(/\s+/g, ' ').trim();
  function diapos() { return Array.from(document.querySelectorAll('.slide')); }
  function indiceActual() {
    try { if (typeof current === 'number') return current; } catch (e) {}
    const els = diapos();
    const i = els.findIndex(el => el.classList.contains('active'));
    return i < 0 ? 0 : i;
  }
  function titulo(i) {
    const el = diapos()[i];
    let t = '';
    if (el) {
      for (const sel of ['.stitle', 'h1', 'h2', 'h3', 'blockquote', '.eyebrow']) {
        const h = el.querySelector(sel);
        if (!h) continue;
        const c = h.cloneNode(true);
        c.querySelectorAll('br').forEach(br => br.replaceWith(' '));
        if (limpiar(c.textContent)) { t = limpiar(c.textContent); break; }
      }
    }
    if (!t) { try { t = limpiar(SLIDES[i].tag); } catch (e) {} }
    if (!t) t = 'Diapositiva ' + (i + 1);
    return t.length > 90 ? t.slice(0, 87) + '…' : t;
  }
  function etapa(i) {
    try { return limpiar(SLIDES[i].tag); } catch (e) { return ''; }
  }
  function estadoDiapo() {
    const total = diapos().length;
    const i = indiceActual();
    const info = n => (n >= 0 && n < total) ? { n: n + 1, titulo: titulo(n), etapa: etapa(n) } : null;
    return { accion: 'estado', total, actual: info(i), anterior: info(i - 1), siguiente: info(i + 1) };
  }

  // ---------- Interfaz en la compu ----------
  const css = document.createElement('style');
  css.textContent = `
    #rc-panel{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;
      background:rgba(10,14,20,.82);font-family:Rubik,system-ui,sans-serif;color:#fff}
    #rc-panel.on{display:flex}
    #rc-caja{background:#fff;color:#1b2430;border-radius:20px;padding:28px 32px;text-align:center;max-width:90vw}
    #rc-caja h2{margin:0 0 4px;font-size:22px;font-weight:600}
    #rc-caja p{margin:0 0 16px;color:#5b6675;font-size:15px}
    #rc-qr svg{width:min(320px,60vh);height:auto;display:block;margin:0 auto}
    #rc-estado{margin-top:14px;font-size:14px;color:#5b6675}
    #rc-link{display:block;margin-top:6px;font-size:12px;color:#4fa6d9;word-break:break-all}
    #rc-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);opacity:0;
      z-index:99999;background:#1b2430;color:#fff;font:500 15px Rubik,system-ui,sans-serif;
      padding:10px 18px;border-radius:999px;transition:.3s;pointer-events:none}
    #rc-toast.on{opacity:.95;transform:translateX(-50%)}
  `;
  document.head.appendChild(css);

  const panel = document.createElement('div');
  panel.id = 'rc-panel';
  panel.innerHTML = `<div id="rc-caja">
      <h2>📱 Control remoto</h2>
      <p>Escaneá con la cámara del celu</p>
      <div id="rc-qr">Preparando…</div>
      <div id="rc-estado">Esperando conexión…</div>
      <a id="rc-link" target="_blank"></a>
    </div>`;
  const toast = document.createElement('div');
  toast.id = 'rc-toast';
  document.body.append(panel, toast);

  let tToast;
  function avisar(txt) {
    toast.textContent = txt;
    toast.classList.add('on');
    clearTimeout(tToast);
    tToast = setTimeout(() => toast.classList.remove('on'), 2500);
  }
  const estado = txt => (document.getElementById('rc-estado').textContent = txt);

  panel.addEventListener('click', e => { if (e.target === panel) panel.classList.remove('on'); });
  document.addEventListener('keydown', e => {
    if (e.isTrusted && (e.key === 'q' || e.key === 'Q') && !e.ctrlKey && !e.metaKey) {
      panel.classList.toggle('on');
    }
  });
  if (/[?&]remoto/.test(location.search)) panel.classList.add('on');

  // ---------- Conexión ----------
  let peer, conectados = 0;
  const conexiones = new Set();
  let ultimo = -1;
  function difundir() {
    const est = estadoDiapo();
    conexiones.forEach(c => { try { c.open && c.send(est); } catch (e) {} });
  }
  setInterval(() => {
    const i = indiceActual();
    if (i !== ultimo) { ultimo = i; difundir(); }
  }, 200);

  function idNuevo() {
    return 'tfg-' + Math.random().toString(36).slice(2, 8);
  }

  function iniciar(id) {
    peer = new Peer(id);

    peer.on('open', pid => {
      try { sessionStorage.setItem('rc-id', pid); } catch (e) {}
      const url = new URL('control.html', location.href);
      url.hash = pid;
      const qr = qrcode(0, 'M');
      qr.addData(url.href);
      qr.make();
      document.getElementById('rc-qr').innerHTML = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
      const a = document.getElementById('rc-link');
      a.href = url.href; a.textContent = url.href;
      estado('Esperando conexión…');
    });

    peer.on('connection', conn => {
      conn.on('open', () => {
        conectados++;
        conexiones.add(conn);
        conn.send(estadoDiapo());
        panel.classList.remove('on');
        avisar('📱 Control conectado');
        estado('Conectado ✔');
      });
      conn.on('data', d => {
        if (d && d.accion === 'ping') return conn.send({ accion: 'pong' });
        if (d && d.accion === 'estado') return conn.send(estadoDiapo());
        if (d && d.accion) apretar(d.accion);
      });
      conn.on('close', () => {
        conexiones.delete(conn);
        conectados = Math.max(0, conectados - 1);
        if (!conectados) { avisar('📱 Control desconectado'); estado('Esperando conexión…'); }
      });
    });

    peer.on('disconnected', () => { try { peer.reconnect(); } catch (e) {} });
    peer.on('error', err => {
      if (err.type === 'unavailable-id') { peer.destroy(); iniciar(idNuevo()); }
      else estado('Error: ' + err.type + ' (reintentá recargando)');
    });
  }

  window.addEventListener('pagehide', () => { try { peer && peer.destroy(); } catch (e) {} });

  Promise.all([cargar(PEERJS), cargar(QRLIB)])
    .then(() => {
      let id;
      try { id = sessionStorage.getItem('rc-id'); } catch (e) {}
      iniciar(id || idNuevo());
    })
    .catch(() => estado('No se pudieron cargar las librerías (¿hay internet?)'));
})();
