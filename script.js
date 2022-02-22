////////////////////////////////////////////////////////////////////////////////////
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

function shiftBody() {
  if (snake.length == 1) {
    snake[0].classList.remove("snake-head");
    snake[0].classList.remove("snake");
    return;
  }

  snake[snake.length - 1].classList.remove("snake");
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = snake[i - 1];
  }
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

// document
//   .querySelector(".grid")
//   .querySelectorAll("*")
//   .forEach(el => el.classList.remove("snake-head"));

function setUpGame() {
  spawnSnake();
  document.documentElement.addEventListener("keydown", beginGame);
  spawnFood();
}
setUpGame();

function spawnSnake() {
  snake = [];

  const head = randomBox();
  head.classList.add("snake");
  head.classList.add("snake-head");
  snake.push(head);
  console.log(snake[0]);
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

  playing = true;

  let nextDirection = e.key;
  document.documentElement.removeEventListener("keydown", beginGame);

  document.documentElement.addEventListener("keydown", e => {
    nextDirection = e.key;
    doMove(nextDirection);
    clearInterval(moveInterval);
    // moveInterval = setInterval(doMove, 50, nextDirection);
  });

  doMove(nextDirection);
  // moveInterval = setInterval(doMove, 50, nextDirection);
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
  const [row, column] = (loc = snakeHead
    .getAttribute("id")
    .slice(5)
    .split("-")
    .map(s => Number(s)));

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

  // snakeHead.classList.remove("snake-head");
  // loc[shifted] += dir;
  // const newHead = document.getElementById(`box__${loc[0]}-${loc[1]}`);
  // newHead.classList.add("snake-head");
  // snake.head = newHead;

  // if (newHead.classList.contains("food")) {
  //   newHead.classList.remove("food");
  //   expandSnake();
  //   spawnFood();
  // }

  loc[shifted] += dir;
  shiftBody();
  const newHead = document.getElementById(`box__${loc[0]}-${loc[1]}`);
  snake[0] = newHead;
  newHead.classList.add("snake-head");
  newHead.classList.add("snake");

  if (newHead.classList.contains("food")) {
    newHead.classList.remove("food");
    snakeHead.classList.add("snake");
    snake.push(snakeHead);

    spawnFood();
  }
}

function endGame() {
  resetGame();
}

function resetGame() {
  points = 0;
  clearInterval(moveInterval);

  snake.head.box.classList.remove("snake-head");
  document
    .querySelector(".grid")
    .querySelectorAll("*")
    .forEach(el => {
      el.classList.remove("food");
    });

  setUpGame();
}

function spawnFood() {
  randomBox().classList.add("food");
  points++;
}
