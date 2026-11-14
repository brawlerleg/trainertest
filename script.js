// ссылка на веб-приложение из google apps script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPydvhiWiwUjMmU-XsJLvxiB_2JPW-jvDTDfQrVcCZHNz21sMEOoK02eNMKylrz5NX/exec";

// все вопросы тут, чтобы не писать html для каждого отдельно
const questions = [
  {
    text: "Занимаешься ли ты физическими упражнениями самостоятельно?",
    options: ["Да, регулярно", "Иногда", "Редко", "Вообще не занимаюсь"]
  },
  {
    text: "Насколько важно правильно выполнять упражнения?",
    options: ["Очень важно", "Скорее важно", "Не особо важно", "Не задумывался об этом"]
  },
  {
    text: "Как ты обычно понимаешь, что выполняешь упражнение неправильно?",
    options: ["По ощущениям", "Смотрю обучающие видео", "Мне подсказывает тренер или другой человек", "Обычно не замечаю ошибок"]
  },
  {
    text: "Сложно ли самостоятельно определить ошибки в положении тела?",
    options: ["Да, сложно", "Иногда сложно", "Обычно несложно", "Никогда об этом не думал"]
  },
  {
    text: "Было бы тебе удобно видеть положение своего скелета на экране во время упражнения?",
    options: ["Да, это интересно и полезно", "Возможно, попробовал бы", "Скорее нет", "Нет"]
  },
  {
    text: "Хотел бы ты получать автоматические подсказки о неправильном положении суставов?",
    options: ["Да, определённо", "Скорее да", "Скорее нет", "Нет"]
  },
  {
    text: "В каких ситуациях такой тренажёр мог бы пригодиться?",
    options: ["При самостоятельных тренировках", "При изучении новых упражнений", "На уроках физкультуры", "Не вижу применения"]
  },
  {
    text: "Насколько вероятно, что ты попробовал бы такой тренажёр?",
    options: ["Точно попробовал бы", "Скорее попробовал бы", "Скорее не стал бы", "Точно не стал бы"]
  }
];

let current = 0; // номер текущего вопроса
let answers = []; // сюда складываем выбранные ответы по порядку

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");

const counter = document.getElementById("counter");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const optionsBox = document.getElementById("options");
const backBtn = document.getElementById("back-btn");
const retryBtn = document.getElementById("retry-btn");
const endTitle = document.getElementById("end-title");
const endText = document.getElementById("end-text");

// прячем все экраны и показываем нужный
function showScreen(screen) {
  startScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  screen.classList.remove("hidden");
}

function showQuestion() {
  const q = questions[current];

  counter.textContent = "Вопрос " + (current + 1) + " из " + questions.length;
  progressBar.style.width = (current / questions.length * 100) + "%";
  questionText.textContent = q.text;

  // на первом вопросе кнопка назад не нужна
  if (current === 0) {
    backBtn.classList.add("hidden");
  } else {
    backBtn.classList.remove("hidden");
  }

  optionsBox.innerHTML = "";
  for (let i = 0; i < q.options.length; i++) {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = q.options[i];

    // если на этот вопрос уже отвечали (вернулись назад), подсвечиваем
    if (answers[current] === q.options[i]) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", function () {
      selectAnswer(q.options[i]);
    });
    optionsBox.appendChild(btn);
  }
}

function selectAnswer(answer) {
  answers[current] = answer;

  if (current < questions.length - 1) {
    current++;
    showQuestion();
  } else {
    sendAnswers();
  }
}

function sendAnswers() {
  showScreen(endScreen);
  endTitle.textContent = "Отправляем...";
  endText.textContent = "";
  retryBtn.classList.add("hidden");

  // пока ссылка не вставлена, просто показываем ответы в консоли
  if (SCRIPT_URL === "") {
    console.log(answers);
    endTitle.textContent = "Спасибо за ответы!";
    endText.textContent = "Твоё мнение поможет понять, нужен ли такой тренажёр.";
    return;
  }

  // no-cors нужен, иначе браузер блокирует запрос к google, ответ при этом прочитать нельзя
  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({ answers: answers })
  })
    .then(function () {
      endTitle.textContent = "Спасибо за ответы!";
      endText.textContent = "Твоё мнение поможет понять, нужен ли такой тренажёр.";
    })
    .catch(function () {
      endTitle.textContent = "Не получилось отправить";
      endText.textContent = "Проверь интернет и попробуй ещё раз.";
      retryBtn.classList.remove("hidden");
    });
}

document.getElementById("start-btn").addEventListener("click", function () {
  showScreen(quizScreen);
  showQuestion();
});

backBtn.addEventListener("click", function () {
  current--;
  showQuestion();
});

retryBtn.addEventListener("click", sendAnswers);
