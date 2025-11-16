(function () {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-link");
  const navbar = document.querySelector(".navbar");

  function goTo(id) {
    sections.forEach(s => s.classList.remove("active"));
    const target = document.getElementById(id);
    if (target) target.classList.add("active");

    // Hide navbar ONLY in welcome & mode
    if (id === "welcome" || id === "mode") {
      navbar.style.display = "none";
    } else {
      navbar.style.display = "flex";
    }

    // Update nav highlight
    navLinks.forEach(link => {
      link.classList.toggle("active", link.dataset.target === id);
    });
  }

  // Welcome page → klik bebas untuk masuk main
  const welcomeEl = document.getElementById("welcome");
  if (welcomeEl) {
    welcomeEl.addEventListener("click", (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'button' || tag === 'a') return;
      goTo("main");
    });
  }

  // data-action="goto"
  document.querySelectorAll("[data-action='goto']").forEach(btn => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      goTo(btn.dataset.target);
    });
  });

  // Volume toggle
  const btnVolume = document.getElementById("btnVolume");
  let vol = true;
  if (btnVolume) {
    btnVolume.addEventListener("click", (ev) => {
      ev.stopPropagation();
      vol = !vol;
      btnVolume.textContent = vol ? "🔊" : "🔇";
    });
  }

  /* --------------------------
     CREDIT PANEL (FINAL)
  ---------------------------*/
  const btnCredit = document.getElementById("btnCredit");
  const creditPanel = document.getElementById("creditPanel");
  const closeCredit = document.getElementById("closeCredit");

  if (btnCredit && creditPanel && closeCredit) {
    btnCredit.addEventListener("click", (ev) => {
      ev.stopPropagation();
      creditPanel.classList.add("active");
    });

    closeCredit.addEventListener("click", () => {
      creditPanel.classList.remove("active");
    });

    // klik area gelap tutup panel
    creditPanel.addEventListener("click", (e) => {
      if (e.target === creditPanel) {
        creditPanel.classList.remove("active");
      }
    });
  }

  // Start page (hash aware)
  (function init() {
    const fromHash = (location.hash || "").replace("#", "");
    const start = fromHash || "welcome";
    goTo(start);
  })();

  // SETTINGS PANEL
  const settingsPanel = document.getElementById("settingsPanel");
  const closeSettings = document.getElementById("closeSettings");
  const toggleDark = document.getElementById("toggleDark");
  const btnSettings = document.getElementById("btnSettings"); // missing earlier

  if (btnSettings && settingsPanel) {
    btnSettings.addEventListener("click", (ev) => {
      ev.stopPropagation();
      settingsPanel.classList.add("active");
    });
  }

  // Close button
  if (closeSettings) {
    closeSettings.addEventListener("click", () => {
      settingsPanel.classList.remove("active");
    });
  }

  // Click outside to close
  if (settingsPanel) {
    settingsPanel.addEventListener("click", (e) => {
      if (e.target === settingsPanel) {
        settingsPanel.classList.remove("active");
      }
    });
  }

  /* ========== DARK MODE ========== */
  if (toggleDark) {
    toggleDark.addEventListener("change", () => {
      if (toggleDark.checked) {
        document.body.classList.add("dark");
        localStorage.setItem("darkmode", "on");
      } else {
        document.body.classList.remove("dark");
        localStorage.setItem("darkmode", "off");
      }
    });

    // Load saved theme
    if (localStorage.getItem("darkmode") === "on") {
      document.body.classList.add("dark");
      toggleDark.checked = true;
    }
  }

})(); // end original IIFE


/* ==================================================
   AR EMBED LOADER — akan menyuntik markup + css + js
   supaya AR berjalan langsung di landing tanpa pindah
   ================================================== */

(function() {
  const btn = document.getElementById('btnOpenAR');
  if (!btn) return;

  async function injectCss(href) {
    return new Promise((res, rej) => {
      if (document.querySelector(`link[href="${href}"]`)) return res();
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      l.onload = () => res();
      l.onerror = () => rej(new Error('Failed to load css ' + href));
      document.head.appendChild(l);
    });
  }

  function injectHtmlIntoRoot(root) {
    root.innerHTML = `
      <header><h3 style="margin:8px 0 0 12px;color:#fff">kARies - AR Edukasi Gigi</h3></header>
      <button id="xrBtn" class="xr-btn" style="position:absolute; top:8px; left:8px; z-index:80;">Enter AR</button>
      <canvas id="canvas" style="position:absolute; inset:0; width:100%; height:100%;"></canvas>
      <div id="ui" style="position:absolute; inset:0; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; pointer-events:none; z-index:80;">
        <div id="bars">
          <div class="status-bar clean">
            <img src="karies-ar/icons/water.png" class="status-icon" alt="Kebersihan">
            <span class="status-label">Kebersihan</span>
            <div class="bar-fill"><div id="cleanFill" class="bar-inner"></div></div>
          </div>
          <div class="status-bar health">
            <img src="karies-ar/icons/heart.png" class="status-icon" alt="Kesehatan">
            <span class="status-label">Kesehatan</span>
            <div class="bar-fill"><div id="healthFill" class="bar-inner"></div></div>
          </div>
        </div>
        <div id="infoText" style="pointer-events:auto; margin-bottom:12px; background:rgba(255,255,255,0.95); border-radius:15px; padding:8px 14px; color:#0b4f8a;">
          Arahkan kamera ke lantai dan tekan Enter AR
        </div>
        <div id="buttons" style="pointer-events:auto; margin-bottom:25px; display:flex; gap:20px; justify-content:center;">
          <button class="action-btn brush" data-action="brush">
            <img src="karies-ar/icons/sikat.png" alt="Gosok Gigi"><span>Gosok Gigi</span>
          </button>
          <button class="action-btn healthy" data-action="healthy">
            <img src="karies-ar/icons/wortel.png" alt="Makanan Sehat"><span>Makanan Sehat</span>
          </button>
          <button class="action-btn sweet" data-action="sweet">
            <img src="karies-ar/icons/permen.png" alt="Makanan Manis"><span>Makanan Manis</span>
          </button>
        </div>
      </div>
    `;
  }

  function injectScripts() {
    return new Promise((res) => {
      if (document.querySelector('script[src="karies-ar/ui.js"]')) {
        // already loaded
        return res();
      }

      // ui.js
      const s1 = document.createElement('script');
      s1.src = 'karies-ar/ui.js';
      s1.defer = true;
      s1.onload = () => {
        // index.js (module)
        const s2 = document.createElement('script');
        s2.type = 'module';
        s2.src = 'karies-ar/index.js';
        s2.onload = () => res();
        s2.onerror = () => { console.error('Failed to load karies-ar/index.js'); res(); };
        document.body.appendChild(s2);
      };
      s1.onerror = () => { console.error('Failed to load karies-ar/ui.js'); res(); };
      document.body.appendChild(s1);
    });
  }

  async function openARInline() {
    const root = document.getElementById('arEmbedRoot');
    if (!root) return alert('AR root missing');
    root.style.display = 'block';
    root.style.background = '#000';
    root.style.padding = '0';
    root.style.overflow = 'hidden';
    injectHtmlIntoRoot(root);

    // load AR stylesheet (ui.css) from karies-ar
    try {
      await injectCss('karies-ar/ui.css');
    } catch (e) {
      console.warn('UI css failed to load', e);
    }

    // allow pointer events for interactive bits
    setTimeout(() => {
      const ui = root.querySelector('#ui');
      if (ui) ui.style.pointerEvents = 'none';
      root.querySelectorAll('#buttons, #infoText, .action-btn, .xr-btn').forEach(el => {
        if (el) el.style.pointerEvents = 'auto';
      });
    }, 80);

    // inject scripts (ui.js then index.js module)
    await injectScripts();

    // create close overlay button if not present
    if (!document.getElementById('btnCloseEmbeddedAR')) {
      const closeBtn = document.createElement('button');
      closeBtn.id = 'btnCloseEmbeddedAR';
      closeBtn.textContent = '✖ Close AR';
      Object.assign(closeBtn.style, {
        position:'absolute', top:'10px', right:'10px', zIndex:9999, padding:'8px 10px',
        background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'8px', cursor:'pointer'
      });
      closeBtn.addEventListener('click', () => {
        try { window.dispatchEvent(new CustomEvent('reset')); } catch(e){}
        const root = document.getElementById('arEmbedRoot');
        if (root) root.style.display = 'none';
        // hide close button
        closeBtn.remove();
      });
      document.body.appendChild(closeBtn);
    }
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openARInline();
  });
})();
