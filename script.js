const grid = document.querySelector(".grid");
const playButton = document.querySelector(".btn__play");
const ROW_COUNT = 20;
const COLUMN_COUNT = 20;
let points = 0;

let playing = false;
const snake = {};
let moveInterval;

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

function getLastSnakeNode() {}

for (let i = 1; i <= ROW_COUNT; i++) {
  for (let k = 1; k <= COLUMN_COUNT; k++) {
    const box = document.createElement("div");
    box.setAttribute("id", `box__${i}-${k}`);
    box.classList.add("box");
    box.style.gridArea = `${i} / ${k} / span 1 / span 1`;
    grid.append(box);
  }
}

playButton.addEventListener("click", e => {
  document
    .querySelector(".grid")
    .querySelectorAll("*")
    .forEach(el => el.classList.remove("snake-head"));
  startGame(e);
});

function startGame(e) {
  spawnSnake();
  document.documentElement.addEventListener("keypress", beginGame);
  spawnFood();
}

function spawnSnake() {
  const head = randomBox();
  head.classList.add("snake-head");
  snake.root = head;
}

function beginGame(e) {
  if (e.key != "w" && e.key != "a" && e.key != "s" && e.key != "d") return;

  playing = true;

  let nextDirection = e.key;
  document.documentElement.removeEventListener("keypress", beginGame);

  document.documentElement.addEventListener("keypress", e => {
    nextDirection = e.key;
    doMove(nextDirection);
    clearInterval(moveInterval);
    moveInterval = setInterval(doMove, 50, nextDirection);
  });

  doMove(nextDirection);
  moveInterval = setInterval(doMove, 50, nextDirection);
}

function doMove(direction) {
  switch (direction) {
    case "w":
      move("up");
      break;
    case "a":
      move("left");
      break;
    case "s":
      move("down");
      break;
    case "d":
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
      if (row == 1) endGame();
      else {
        shifted = 0;
        dir = -1;
      }
      break;
    case "down":
      if (row == ROW_COUNT) endGame();
      else {
        shifted = 0;
        dir = 1;
      }
      break;
    case "left":
      if (column == 1) endGame();
      else {
        shifted = 1;
        dir = -1;
      }
      break;
    case "right":
      if (column == COLUMN_COUNT) endGame();
      else {
        shifted = 1;
        dir = 1;
      }
      break;
  }

  snakeHead.classList.remove("snake-head");
  loc[shifted] += dir;
  const newHead = document.getElementById(`box__${loc[0]}-${loc[1]}`);
  newHead.classList.add("snake-head");
  snake.root = newHead;
  curr = snake.root;

  if (newHead.classList.contains("food")) {
    newHead.classList.remove("food");
    spawnFood();
  }
}

function endGame() {
  resetGame();
}

function resetGame() {
  points = 0;
  clearInterval(moveInterval);
  console.log(snake.root.classList);
  snake.root.classList.remove("snake-head");
  document
    .querySelector(".grid")
    .querySelectorAll("*")
    .forEach(el => {
      el.classList.remove(".food");
    });

  setTimeout(startGame, 1000);
}

function spawnFood() {
  const food = randomBox();
  food.classList.add("food");
  points++;
}
