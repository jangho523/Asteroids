let player;

function setup() {
  createCanvas(800, 800);
  player = new Player(createVector(width / 2, height / 2));
}

function draw() {
  background(0);
  player.update();
  player.draw();
}
