 // ── REVEAL ON SCROLL ──────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── SEMAPHORE SIMULATION ───────────────────────────────────
  const ledR = document.getElementById('led-r');
  const ledY = document.getElementById('led-y');
  const ledG = document.getElementById('led-g');
  const simState = document.getElementById('sim-state');
  const simTimer = document.getElementById('sim-timer');
  const progressFill = document.getElementById('progress-fill');
  const simBtn = document.getElementById('sim-btn');

  const phases = [
    { name: 'Verde — Via libera', duration: 5000, led: 'g', color: 'var(--green)' },
    { name: 'Giallo — Rallentare', duration: 2000, led: 'y', color: 'var(--yellow)' },
    { name: 'Rosso — Stop', duration: 5000, led: 'r', color: 'var(--red)' },
  ];

  let currentPhase = 0;
  let phaseStart = Date.now();
  let running = true;
  let rafId;

  function setPhase(idx) {
    ledR.classList.remove('on');
    ledY.classList.remove('on');
    ledG.classList.remove('on');
    const p = phases[idx];
    if (p.led === 'r') ledR.classList.add('on');
    if (p.led === 'y') ledY.classList.add('on');
    if (p.led === 'g') ledG.classList.add('on');
    simState.style.color = p.color;
    simState.textContent = p.name;
    progressFill.style.background = p.color;
    phaseStart = Date.now();
    progressFill.style.transition = 'none';
    progressFill.style.width = '100%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progressFill.style.transition = `width ${p.duration}ms linear`;
        progressFill.style.width = '0%';
      });
    });
  }

  function tick() {
    if (!running) { rafId = requestAnimationFrame(tick); return; }
    const p = phases[currentPhase];
    const elapsed = Date.now() - phaseStart;
    const rem = Math.max(0, p.duration - elapsed);
    simTimer.textContent = (rem / 1000).toFixed(1) + 's';
    if (elapsed >= p.duration) {
      currentPhase = (currentPhase + 1) % phases.length;
      setPhase(currentPhase);
    }
    rafId = requestAnimationFrame(tick);
  }

  simBtn.addEventListener('click', () => {
    running = !running;
    simBtn.textContent = running ? '⏸ Pausa' : '▶ Avvia';
    if (running) {
      // compensate pause time
      phaseStart = Date.now() - (phases[currentPhase].duration - parseFloat(simTimer.textContent) * 1000);
      const p = phases[currentPhase];
      const rem = parseFloat(simTimer.textContent) * 1000;
      progressFill.style.transition = `width ${rem}ms linear`;
      progressFill.style.width = '0%';
    } else {
      progressFill.style.transition = 'none';
    }
  });

  setPhase(0);
  rafId = requestAnimationFrame(tick);