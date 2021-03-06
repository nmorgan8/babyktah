class Character {
  constructor(x, y, color, radius, speed) {
    Object.assign(this, { x, y, color, radius, speed });
  }
  draw() {
    fill(this.color);
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
    ellipse(this.x, this.y, this.radius * 2);
  }
  move(target) {
    this.x += (target.x - this.x) * this.speed;
    this.y += (target.y - this.y) * this.speed;
  }
}

let healthBar = document.querySelector("#health");

let baseSpeed = 0.05;
let turboSpeed = 0.3;
let shrinkRadius = 5;

const player = new Character(30, 30, "blue", 10, 0.05);
const enemies = [
  new Character(300, 0, "rgb(200,190,80)", 15, 0.01),
  new Character(300, 300, "rgb(240,100,250)", 17, 0.03),
  new Character(0, 300, "rgb(80,200,235)", 20, 0.003),
  new Character(20, 400, "rgb(100,170,190)", 12, 0.02)
];
let scarecrow;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("js-holder");
  noStroke();
}

function draw() {
  background("lightgreen");
  player.draw();
  player.move({ x: mouseX, y: mouseY });
  enemies.forEach(enemy => enemy.draw());
  enemies.forEach(enemy => enemy.move(scarecrow || player));
  showScore();
  if (scarecrow) {
    scarecrow.draw();
    scarecrow.ttl--;
    if (scarecrow.ttl < 0) {
      scarecrow = undefined;
    }
  }
  adjust();
  if (healthBar.value <= 0) {
    // TODO: Message game over
    noLoop();
    gameOver();
  }
}

const spawnEnemy = setInterval(newEnemy, 3000)

function newEnemy(){
  enemies.push(new Character(width/2, height/2, getRandomRgb(), Math.floor(Math.random() * 15 + 10), Math.random() * 0.025 + 0.01));
}

function adjust() {
  const characters = [player, ...enemies];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      pushOff(characters[i], characters[j]);
    }
  }
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const distance = Math.hypot(dx, dy);
  let overlap = c1.radius + c2.radius - distance;
  if (overlap > 0) {
    if (c1 === player) {
      healthBar.value -= 1;
    }
    const adjustX = overlap / 2 * (dx / distance);
    const adjustY = overlap / 2 * (dy / distance);
    c1.x -= adjustX;
    c1.y -= adjustY;
    c2.x += adjustX;
    c2.y += adjustY;
  }
}

function mouseClicked() {
  for(let i=0; i < 5; i++){
    if (!scarecrow) {
      scarecrow = new Character(player.x, player.y, "white", 10, 0);
      scarecrow.ttl = frameRate() * 5;
    }
  }
}

function keyPressed() {
  if (key === " ") {
    player.speed = turboSpeed;
    setTimeout(() => {
      player.speed = baseSpeed;
    }, 5000);
  }
  if (key === "z" || key === "Z") {
    player.radius = shrinkRadius;
    setTimeout(() => {
      player.radius = 15;
    }, 3000);
  }
}

const scoreCounter = document.getElementById('seconds-counter');
let score = 0;
const setScoreIncrement = setInterval(countScore, 1000);

function countScore() {
  score += 1;
}

function showScore(){
    scoreCounter.textContent = score;
}

function getRandomRgb() {
  let num = Math.round(0xffffff * Math.random());
  let r = num >> 16;
  let g = num >> 8 & 255;
  let b = num & 255;
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

function gameOver() {
  textAlign(CENTER);
  textFont("Creepster");
  textSize(65);
  fill("red");
  text("GAME OVER", width / 2, height / 2);
}
