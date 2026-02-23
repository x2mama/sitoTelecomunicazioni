// ── SIMULAZIONE SEMPLICE DEL SEMAFORO ─────────────────────
const ledR = document.getElementById('led-r');
const ledY = document.getElementById('led-y');
const ledG = document.getElementById('led-g');
const simState = document.getElementById('sim-state');

const phases = [
  { name: 'Verde — Via libera', duration: 5000, led: 'g', color: 'var(--green)' },
  { name: 'Giallo — Rallentare', duration: 2000, led: 'y', color: 'var(--yellow)' },
  { name: 'Rosso — Stop',       duration: 5000, led: 'r', color: 'var(--red)' },
];

function showPhase(index) {
  const phase = phases[index];

  // spegne tutti i LED
  ledR.classList.remove('on');
  ledY.classList.remove('on');
  ledG.classList.remove('on');

  // accende il LED corrispondente
  if (phase.led === 'r') ledR.classList.add('on');
  if (phase.led === 'y') ledY.classList.add('on');
  if (phase.led === 'g') ledG.classList.add('on');

  // aggiorna il testo descrittivo
  simState.textContent = phase.name;
  simState.style.color = phase.color;
}

function cycle(index) {
  showPhase(index);
  const nextIndex = (index + 1) % phases.length;
  setTimeout(() => cycle(nextIndex), phases[index].duration);
}

// avvia il ciclo dal verde
cycle(0);