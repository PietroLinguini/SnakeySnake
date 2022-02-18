const grid = document.querySelector(".grid");
const playButton = document.querySelector(".btn__play");
const ROW_COUNT = 10;
const COLUMN_COUNT = 10;
let moving = false;

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min + 1) + min);

for (let i = 1; i <= 15; i++) {
  for (let k = 1; k <= 15; k++) {
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
  document.documentElement.addEventListener("keypress", startMoving);
}

function spawnSnake() {
  const row = randomInt(1, ROW_COUNT);
  const col = randomInt(1, COLUMN_COUNT);
  const head = document.getElementById(`box__${row}-${col}`);
  head.classList.add("snake-head");
}

function startMoving(e) {
  if (e.key != "w" && e.key != "a" && e.key != "s" && e.key != "d") return;

  document.documentElement.removeEventListener("keypress", startMoving);
  moving = true;
  switch (e.key) {
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
  switch (direction) {
    case "up":
      const headLocation = document
        .querySelector(".snake-head")
        .getAttribute("id");
  }
}
