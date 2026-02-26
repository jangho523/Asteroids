let player;
let largeAsteroids = [];

function setup() {
  createCanvas(800, 800);
  player = new Player(createVector(width / 2, height / 2));
  largeAsteroids = makeAsteroids(30);
}

function draw() {
  background(0);
  player.update();
  player.draw();

  for (let asteroid of largeAsteroids) {
    asteroid.update();
    asteroid.draw();
  }
}

function makeAsteroids(count) {
  return [...new Array(count)].map(
    () =>
      new Asteroid(
        30,
        createVector(random(width), random(height)),
        p5.Vector.random2D(),
      ),
  );
}
