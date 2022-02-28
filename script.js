////////////////////////////////////////////////////////////////////////////////////
// Selectors and Constants
const grid = document.querySelector(".grid");
const playButton = document.querySelector(".btn__play");
const ROW_COUNT = 20;
const COLUMN_COUNT = 20;

////////////////////////////////////////////////////////////////////////////////////
// Game state
let points = 0;
let playing = false;
let moveInterval;

////////////////////////////////////////////////////////////////////////////////////
// Snake manipulation
let snake = [];

function setSnakeBox(row, column) {
  document.getElementById(`box__${row}-${column}`).classList.add("snake");
}

function shiftBody() {
  const [lastRow, lastColumn] = snake.at(-1);
  document
    .getElementById(`box__${lastRow}-${lastColumn}`)
    .classList.remove("snake");

  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = snake[i - 1];
    setSnakeBox(snake[i][0], snake[i][1]);
  }
}

const getRowAndColumn = box => {
  if (box.classList.contains("box"))
    return box
      .getAttribute("id")
      .match(/\d+/g)
      .map(s => Number(s));
  else return [-1, -1];
};

function turn(e) {
  nextDirection = e.key;
  doMove(nextDirection);
  clearInterval(moveInterval);
  moveInterval = setInterval(doMove, 50, nextDirection);
}

////////////////////////////////////////////////////////////////////////////////////
// Math
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min + 1) + min);

const randomRowAndColumn = () => [
  randomInt(1, ROW_COUNT),
  randomInt(1, COLUMN_COUNT),
];

const randomBox = () => {
  const [row, column] = randomRowAndColumn();
  return document.getElementById(`box__${row}-${column}`);
};

////////////////////////////////////////////////////////////////////////////////////
// Game logic
for (let i = 1; i <= ROW_COUNT; i++) {
  for (let k = 1; k <= COLUMN_COUNT; k++) {
    const box = document.createElement("div");
    box.setAttribute("id", `box__${i}-${k}`);
    box.classList.add("box");
    box.style.gridArea = `${i} / ${k} / span 1 / span 1`;
    grid.append(box);
  }
}

function initGame() {
  snake = [];
  spawnSnake();
  document.addEventListener("keydown", beginGame);
  spawnFood();
}
initGame();

function spawnSnake() {
  const head = randomBox();
  head.classList.add("snake");
  head.classList.add("snake-head");
  snake.push(getRowAndColumn(head));
}

function beginGame(e) {
  if (
    e.key != "w" &&
    e.key != "a" &&
    e.key != "s" &&
    e.key != "d" &&
    e.key != "ArrowUp" &&
    e.key != "ArrowDown" &&
    e.key != "ArrowLeft" &&
    e.key != "ArrowRight"
  )
    return;

  document.removeEventListener("keydown", beginGame);
  playing = true;

  let nextDirection = e.key;

  document.addEventListener("keydown", turn);

  doMove(nextDirection);
  moveInterval = setInterval(doMove, 50, nextDirection);
}

function doMove(direction) {
  switch (direction) {
    case "w":
    case "ArrowUp":
      move("up");
      break;
    case "a":
    case "ArrowLeft":
      move("left");
      break;
    case "s":
    case "ArrowDown":
      move("down");
      break;
    case "d":
    case "ArrowRight":
      move("right");
      break;
  }
}

function move(direction) {
  const snakeHead = document.querySelector(".snake-head");
  const [row, column] = (loc = getRowAndColumn(snakeHead));

  let shifted = (dir = 0);
  switch (direction) {
    case "up":
      if (row == 1) {
        endGame();
        return;
      } else {
        shifted = 0;
        dir = -1;
      }
      break;
    case "down":
      if (row == ROW_COUNT) {
        endGame();
        return;
      } else {
        shifted = 0;
        dir = 1;
      }
      break;
    case "left":
      if (column == 1) {
        endGame();
        return;
      } else {
        shifted = 1;
        dir = -1;
      }
      break;
    case "right":
      if (column == COLUMN_COUNT) {
        endGame();
        return;
      } else {
        shifted = 1;
        dir = 1;
      }
      break;
  }

  loc[shifted] += dir;
  const newHead = document.getElementById(`box__${loc[0]}-${loc[1]}`);

  if (newHead.classList.contains("food")) {
    points++;
    newHead.classList.remove("food");
    snakeHead.classList.add("snake");
    snake.splice(0, 0, getRowAndColumn(newHead));
    spawnFood();
  } else {
    shiftBody();
    snake[0] = getRowAndColumn(newHead);
  }

  snakeHead.classList.remove("snake-head");
  newHead.classList.add("snake-head");
}

function endGame() {
  playing = false;
  resetGame();
}

function resetGame() {
  points = 0;

  clearInterval(moveInterval);
  moveInterval = null;
  document.removeEventListener("keydown", turn);

  document
    .getElementById(`box__${snake[0][0]}-${snake[0][1]}`)
    .classList.remove("snake-head");

  snake.forEach(([row, col]) => {
    document.getElementById(`box__${row}-${col}`).classList.remove("snake");
  });

  document
    .querySelector(".grid")
    .querySelectorAll("*")
    .forEach(el => {
      el.classList.remove("food");
    });

  initGame();
}

function spawnFood() {
  randomBox().classList.add("food");
}
