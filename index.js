import { createElement, getRandomNumber } from "./utils/utils.js";

let begin = 48;
let end = 57;

const state = {
  level: "easy",
  currentKeyboard: [],
  round: 1,
  sequence: [],
  result: [],
  error: 0,
  hint: 0,
  keydown: false,
};

const body = document.querySelector("body");
const modalWrapper = createElement({
  tag: "div",
  className: ["modal-wrapper"],
});

const container = createElement({ tag: "div", className: ["container"] });
const title = createElement({
  tag: "h1",
  className: ["title"],
  content: "Simon Says",
});
const title2 = createElement({
  tag: "h2",
  className: ["title2"],
  content: `Round: ${state.round} / 5`,
});
const message = createElement({
  tag: "h2",
  className: ["error-message"],
  content: "Warning! Error!",
});

const field = createElement({
  tag: "div",
  className: ["field", "hidden"],
});

const keyboard = createElement({ tag: "div", className: ["keyboard"] });
const start = createElement({
  tag: "div",
  className: ["btn", "btn-start"],
  content: "START",
});

const wrapper = createElement({
  tag: "div",
  className: ["wrapper"],
});

const newGameBtn = createElement({
  tag: "button",
  className: ["btn", "hidden"],
  content: "New Game",
});

const repeat = createElement({
  tag: "button",
  className: ["btn", "hidden"],
  content: "Repeat the sequence",
  rest: [{ id: "btn-repeat" }],
});

const next = createElement({
  tag: "button",
  className: ["btn"],
  content: "Next Round",
  rest: [{ id: "btn-next" }],
});

wrapper.append(newGameBtn, repeat);

const levels = createElement({ tag: "div", className: ["levels"] });

const easy = createElement({
  tag: "button",
  className: ["btn", "level-active"],
  content: "Easy",
  rest: [{ disabled: true }, { id: "easy" }],
});
const medium = createElement({
  tag: "button",
  className: ["btn"],
  content: "Medium",
  rest: [{ id: "medium" }],
});
const hard = createElement({
  tag: "button",
  className: ["btn"],
  content: "Hard",
  rest: [{ id: "hard" }],
});
levels.append(easy, medium, hard);

const levelBtns = levels.querySelectorAll(".btn");
// обработчик уровня сложности
levels.addEventListener("click", (e) => {
  start.classList.remove("hidden");
  const currentBtn = e.target;

  if (e.target.classList.contains("btn")) {
    levelBtns.forEach((el) => {
      el.classList.remove("level-active");
      el.removeAttribute("disabled");
    });
    currentBtn.classList.add("level-active");
    currentBtn.setAttribute("disabled", "true");
    keyboard.innerHTML = "";
    const level = e.target.id;
    state.level = level;

    switch (level) {
      case "easy":
        renderKeyboard(level);
        break;
      case "medium":
        renderKeyboard(level);
        break;
      case "hard":
        renderKeyboard(level);
        break;
      default:
        break;
    }
  }
});

newGameBtn.addEventListener("click", (e) => startNewGame());

// обработчик запуска игры
start.addEventListener("click", (e) => startGame());

repeat.addEventListener("click", (e) => {
  state.hint++;
  setBlockKeyboard();
  repeat.setAttribute("disabled", "true");
  repeat.classList.add("inactive");
  message.classList.remove("show");
  field.childNodes.forEach((el) => (el.textContent = ""));
  state.result = [];
  getClickSimulation();
  setTimeout(() => {
    removeBlockKeyboard();
  }, state.round * 1100);
});

next.addEventListener("click", (e) => {
  wrapper.removeChild(next);
  wrapper.append(repeat);
  setTimeout(() => {
    nextRound();
  }, 1000);
});

// функция запуска игры
const startGame = () => {
  if (wrapper.childNodes.length === 1) {
    wrapper.append(repeat);
  }
  setBlockKeyboard();
  levelBtns.forEach((el) => {
    el.removeAttribute("disabled");
  });
  start.classList.add("hidden");
  newGameBtn.classList.remove("hidden");
  repeat.classList.remove("hidden");
  field.classList.remove("hidden");
  title2.classList.add("show");

  renderField();

  levelBtns.forEach((el) => {
    el.setAttribute("disabled", "true");
    if (!el.classList.contains("level-active")) {
      el.classList.add("inactive");
    }
  });

  getClickSimulation();
  setTimeout(() => {
    removeBlockKeyboard();
  }, state.round * 1100);
};

// обработчики событий keydown, keyup и  click

const keyDownHandler = (e) => {
  if (!state.keydown) {
    state.keydown = true;
    const id = e.key.toLocaleUpperCase();
    if (state.currentKeyboard.includes(id)) {
      document.getElementById(id).classList.add("keyboard-btn-active");
    }
  }
};

const keyUpHandler = (e) => {
  const id = e.key.toLocaleUpperCase();
  if (state.currentKeyboard.includes(id)) {
    state.result.push(id);
    setTimeout(() => {
      document.getElementById(id).classList.remove("keyboard-btn-active");
    }, 300);
    fieldFill(id);
    check();
  }
  state.keydown = false;
};

const clickHandler = (e) => {
  const charElement = e.target;
  if (charElement.classList.contains("keyboard-btn")) {
    charElement.classList.add("keyboard-btn-active");
    setTimeout(() => {
      charElement.classList.remove("keyboard-btn-active");
    }, 300);
    state.result.push(charElement.id);
    fieldFill(charElement.id);
    check();
  }
};

function eventHandlers() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
}
keyboard.addEventListener("click", clickHandler);

const renderPage = () => {
  title2.textContent = `Round: ${state.round} / 5`;
  container.append(
    title,
    levels,
    wrapper,
    title2,
    message,
    field,
    keyboard,
    start
  );
  body.append(container);
};

// рендер клавиатуры
function renderKeyboard(level) {
  if (level === "easy") {
    begin = 48;
    end = 57;
  } else if (level === "medium") {
    begin = 65;
    end = 90;
  } else {
    begin = 48;
    end = 90;
  }
  state.currentKeyboard = [];
  for (let i = begin; i <= end; i++) {
    if (i < 58 || i > 64) {
      const char = String.fromCharCode(i);
      state.currentKeyboard.push(char);
      const btn = createElement({
        tag: "button",
        className: ["keyboard-btn", "inactive"],
        content: char,
        rest: [{ id: char }, { disabled: true }],
      });
      keyboard.append(btn);
    }
  }
}

renderKeyboard(state.level);

const fieldFill = (content) => {
  for (const node of field.childNodes) {
    if (!node.textContent) {
      node.textContent = content;
      break;
    }
  }
};

const check = () => {
  const index = state.result.length - 1;
  if (
    JSON.stringify(state.sequence) === JSON.stringify(state.result) &&
    state.round === 5
  ) {
    endGame({
      title: "You Win!",
      message: "You repeated all the sequences correctly.",
    });
    return true;
  }

  if (JSON.stringify(state.sequence) === JSON.stringify(state.result)) {
    setBlockKeyboard();
    wrapper.removeChild(repeat);
    wrapper.append(next);
    newGameBtn.removeAttribute("disabled");
    newGameBtn.classList.remove("inactive");
    message.textContent = "The sequence is repeated correctly!";
    message.classList.add("correct-message");
    message.classList.add("show");
    return true;
  }
  if (state.result[index] !== state.sequence[index]) {
    const keyboardBtns = keyboard.querySelectorAll(".keyboard-btn");
    keyboardBtns.forEach((el) => {
      el.setAttribute("disabled", "true");
      el.classList.add("inactive");
    });
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
    state.error++;
    if (state.error === 2) {
      endGame({
        title: "Game Over",
        message: "You entered the wrong character twice.",
      });
      return false;
    }
    if (state.hint === 1) {
      endGame({
        title: "Game Over",
        message:
          "You have entered the wrong character and have no attempts left to repeat the sequence.",
      });
      return false;
    }

    state.result.pop();
    message.classList.add("show");
    return false;
  }
  if (state.result[index] === state.sequence[index]) {
    return true;
  }
};

const renderField = () => {
  for (let i = 0; i < state.round * 2; i++) {
    const randomChar =
      state.currentKeyboard[
        getRandomNumber(0, state.currentKeyboard.length - 1)
      ];
    state.sequence.push(randomChar);
    const charElement = createElement({ tag: "span", className: ["char"] });
    field.append(charElement);
  }
  console.log(state.sequence);
};

const nextRound = () => {
  message.textContent = "Warning! Error!";
  message.classList.remove("correct-message");
  message.classList.remove("show");
  state.round++;
  title2.textContent = `Round: ${state.round} / 5`;
  field.innerHTML = "";
  repeat.classList.remove("inactive");
  repeat.removeAttribute("disabled");
  clearState();
  renderField();
  renderPage();
  setBlockKeyboard();
  getClickSimulation();
  setTimeout(() => {
    removeBlockKeyboard();
  }, state.round * 1100);
};

const clearState = () => {
  state.sequence = [];
  state.result = [];
  state.hint = 0;
  state.error = 0;
};

const getClickSimulation = () => {
  state.sequence.forEach((id, index) => {
    setTimeout(() => {
      const element = document.getElementById(id);
      element.classList.add("keyboard-btn-active");
      setTimeout(() => {
        element.classList.remove("keyboard-btn-active");
      }, 450);
    }, index * 500);
  });
};

function removeBlockKeyboard() {
  newGameBtn.removeAttribute("disabled");
  newGameBtn.classList.remove("inactive");
  if (state.hint === 0) {
    repeat.removeAttribute("disabled");
    repeat.classList.remove("inactive");
  }

  const keyboardBtns = keyboard.querySelectorAll(".keyboard-btn");
  keyboardBtns.forEach((el) => {
    el.removeAttribute("disabled");
    el.classList.remove("inactive");
  });
  eventHandlers();
}

function setBlockKeyboard() {
  newGameBtn.setAttribute("disabled", "true");
  newGameBtn.classList.add("inactive");
  repeat.setAttribute("disabled", "true");
  repeat.classList.add("inactive");
  const keyboardBtns = keyboard.querySelectorAll(".keyboard-btn");
  keyboardBtns.forEach((el) => {
    el.setAttribute("disabled", "true");
    el.classList.add("inactive");
  });
  document.removeEventListener("keydown", keyDownHandler);
  document.removeEventListener("keyup", keyUpHandler);
}

function endGame(content) {
  const modalContainer = createElement({
    tag: "div",
    className: ["modal-container"],
  });

  const titleModal = createElement({
    tag: "h2",
    className: ["modal-title"],
    content: content.title,
  });

  const modalMessage = createElement({
    tag: "p",
    className: ["modal-message"],
    content: content.message,
  });

  const playAgain = createElement({
    tag: "div",
    className: ["btn", "btn-start"],
    content: "Play Again",
  });

  modalWrapper.append(modalContainer);
  modalContainer.append(titleModal, modalMessage, playAgain);
  playAgain.addEventListener("click", (e) => {
    state.currentKeyboard = [];
    state.round = 1;
    renderKeyboard(state.level);
    modalWrapper.innerHTML = "";
    body.removeChild(modalWrapper);
    startNewGame();
  });
  setBlockKeyboard();
  body.prepend(modalWrapper);
}

function startNewGame() {
  levelBtns.forEach((el) => {
    el.removeAttribute("disabled");
    el.classList.remove("inactive");
  });
  wrapper.childNodes.forEach((node) => {
    if (node.id === "btn-next") {
      wrapper.removeChild(next);
      wrapper.append(repeat);
    }
  });
  clearState();
  state.round = 1;
  keyboard.innerHTML = "";
  field.innerHTML = "";
  field.classList.add("hidden");
  start.classList.remove("hidden");
  newGameBtn.classList.add("hidden");
  newGameBtn.classList.remove("inactive");
  message.classList.remove("show");
  repeat.classList.add("hidden");
  repeat.classList.remove("inactive");
  title2.classList.remove("show");
  levelBtns.forEach((el) => {
    el.removeAttribute("disabled");
  });
  renderPage();
  renderKeyboard(state.level);
}

renderPage();
