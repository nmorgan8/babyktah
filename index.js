class Character {
  constructor(x, y, color, radius, speed) {
    Object.assign(this, { x, y, color, radius, speed });
  }
  draw() {
    fill(this.color);
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
let sendTop = 0;

const player = new Character(30, 30, "blue", 10, 0.05);
const enemies = [
  new Character(300, 0, "rgb(200,190,80)", 15, 0.01),
  new Character(300, 300, "rgb(240,100,250)", 17, 0.03),
  new Character(0, 300, "rgb(80,200,235)", 20, 0.003),
  new Character(20, 400, "rgb(100,170,190)", 12, 0.02),
];
let scarecrow;

function setup()  {
  createCanvas(800, 600);
  noStroke();
}

function draw() {
  background("lightgreen");
  player.draw();
  player.move({x: mouseX, y: mouseY});
  enemies.forEach(enemy => enemy.draw());
  enemies.forEach(enemy => enemy.move(scarecrow || player));
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

function adjust() {
  const characters = [player, ...enemies];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i+1; j < characters.length; j++) {
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
    const adjustX = (overlap / 2) * (dx / distance);
    const adjustY = (overlap / 2) * (dy / distance);
    c1.x -= adjustX;
    c1.y -= adjustY;
    c2.x += adjustX;
    c2.y += adjustY;
  }
}

function mouseClicked() {
  if (!scarecrow) {
    scarecrow = new Character(player.x, player.y, "white", 10, 0);
    scarecrow.ttl = frameRate() * 5;
  }
}

function keyPressed() {
  if (key === " ") {
    player.speed = turboSpeed;
    setTimeout(() => {player.speed = baseSpeed;}, 5000);
  }
  if (key === "z" || key === "Z") {
    enemies.radius = shrinkRadius;
    setTimeout(() => {enemies.radius = 18;}, 4500);
  }
  if (key === "x" || key === "X") {
    enemies.x = sendTop;
    setTimeout(() => {enemies.x = 0;}, 5000);
  }
}

function gameOver() {
  textAlign(CENTER);
  textFont('Creepster');
  textSize(65);
  fill("red")
  text("GAME OVER", width/2, height/2);
}
