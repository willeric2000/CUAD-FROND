const GAME_TIME = 45;
let QUESTIONS = [
  { q: "¿Usaban el número 0?", o: ["Sí", "No", "A veces"], c: 1 },
  { q: "Sistema egipcio?", o: ["Base 2", "Base 10", "Base 20"], c: 1 },
  { q: "3 símbolos de 10 y 2 de 1 =", o: ["32", "23", "12"], c: 0 },
  {
    q: "¿Cómo representarían 24?",
    o: ["2 de 10 y 4 de 1", "4 de 10 y 2 de 1", "24 de 1"],
    c: 0,
  },
  { q: "¿Cómo representarían 30?", o: ["3 de 10", "30 de 1", "1 de 30"], c: 0 },
];

let currentIndex = 0;
let score = 0;
let timeLeft = GAME_TIME;
let timer;
let isPaused = false;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const cardEl = document.getElementById("card");
const timeFill = document.getElementById("timeFill");

document.addEventListener("DOMContentLoaded", () => {
  renderQuestion();
});

function convertirBinarioADecimal() {
  const inputBinario = document.getElementById("binarioInput").value.trim();
  const contenedorResultado = document.getElementById("resultadoBinario");

  if (!contenedorResultado) return;

  if (!/^[01]+$/.test(inputBinario)) {
    contenedorResultado.className = "alert alert-danger mt-4 mb-0";
    contenedorResultado.innerHTML =
      "<strong>Error:</strong> Por favor, ingresa un número binario válido (solo 0 y 1).";
    return;
  }

  const resultadoDecimal = parseInt(inputBinario, 2);

  contenedorResultado.className = "alert alert-info mt-4 mb-0";
  contenedorResultado.innerHTML = `El número binario <strong>${inputBinario}</strong> es el <strong>${resultadoDecimal}</strong> en decimal.`;
}

function convertirDecimalABinario() {
  const inputDecimal = document.getElementById("decimalInput").value.trim();
  const contenedorResultado = document.getElementById("resultadoDecimal");

  if (!contenedorResultado) return;

  if (
    inputDecimal === "" ||
    isNaN(inputDecimal) ||
    parseInt(inputDecimal) < 0
  ) {
    contenedorResultado.className = "alert alert-danger mt-4 mb-0";
    contenedorResultado.innerHTML =
      "<strong>Error:</strong> Por favor, ingresa un número entero positivo.";
    return;
  }

  const numeroDecimal = parseInt(inputDecimal, 10);
  const resultadoBinario = numeroDecimal.toString(2);

  contenedorResultado.className = "alert alert-success mt-4 mb-0";
  contenedorResultado.innerHTML = `El número decimal <strong>${numeroDecimal}</strong> es el <strong>${resultadoBinario}</strong> en binario.`;
}

function updateBar() {
  if (timeFill) timeFill.style.width = (timeLeft / GAME_TIME) * 100 + "%";
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (isPaused) return;
    timeLeft--;
    updateBar();

    if (timeLeft <= 0) {
      clearInterval(timer);
      if (resultEl) resultEl.textContent = "⏱️ Tiempo!";
      playSound("bad");
      nextQuestion();
    }
  }, 1000);
}

function renderQuestion() {
  if (!questionEl && !optionsEl) return;

  clearInterval(timer);
  timeLeft = GAME_TIME;
  updateBar();
  if (resultEl) resultEl.textContent = "";
  if (optionsEl) optionsEl.innerHTML = "";

  const q = QUESTIONS[currentIndex];
  if (questionEl) questionEl.textContent = q.q;

  if (q && q.o) {
    q.o.forEach((text, index) => {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = text;
      btn.onclick = () => checkAnswer(index, btn);
      if (optionsEl) optionsEl.appendChild(btn);
    });
  }

  startTimer();
}

function checkAnswer(index, btn) {
  clearInterval(timer);

  if (index === QUESTIONS[currentIndex].c) {
    if (resultEl) resultEl.textContent = "Correcto ✅";
    btn.classList.add("btn-success");
    playSound("ok");
    score++;
  } else {
    if (resultEl) resultEl.textContent = "Incorrecto ❌";
    btn.classList.add("btn-danger");
    playSound("bad");
  }

  if (scoreEl) scoreEl.textContent = score;
  setTimeout(nextQuestion, 1200);
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < QUESTIONS.length) {
    renderQuestion();
  } else if (cardEl) {
    cardEl.innerHTML = `
      <h2>🎉 Fin del juego</h2>
      <h3>${score} / ${QUESTIONS.length}</h3>
      <button class="btn btn-success mt-3" onclick="location.reload()">Reiniciar</button>`;
  }
}

document.addEventListener("visibilitychange", () => {
  isPaused = document.hidden;
});
