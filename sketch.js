p5.disableFriendlyErrors = true;

let player;
let asteroids = [];
let bullets = [];
let saucers = [];
let score = 0;
let lastSpawnSaucerScore = 0;
let saucerSpawnInterval = 1500;
let lastLifeGainScore = 0;
let extraLifeInterval = 10000;

function setup() {
  createCanvas(800, 800);
  player = new Player(createVector(width / 2, height / 2));
  asteroids = makeAsteroids(20, 50);
}

function draw() {
  background(0);

  for (let bullet of bullets) {
    bullet.update();
    bullet.draw();
  }

  for (let asteroid of asteroids) {
    asteroid.update();
    asteroid.draw();
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].isDead) {
      bullets.splice(i, 1);
    }
  }

  for (let saucer of saucers) {
    saucer.update();
    saucer.draw();
  }

  player.update();
  player.draw();

  checkCollisions();

  scoreManager();

  drawUI();
}

function makeAsteroids(count, size) {
  return [...new Array(count)].map(
    () =>
      new Asteroid(
        size,
        createVector(random(width), random(height)),
        p5.Vector.random2D(),
      ),
  );
}

function checkCollisions() {
  // Player and Asteroids
  if (!player.isInvincible) {
    for (let i = asteroids.length - 1; i >= 0; i--) {
      if (isColliding(player, asteroids[i])) {
        player.loseLife();
        handleAsteroidsHit(i);
        break;
      }
    }
  }

  // Player and Saucers
  if (!player.isInvincible) {
    for (let i = saucers.length - 1; i >= 0; i--) {
      if (isColliding(player, saucers[i])) {
        player.loseLife();
        handleSaucersHit(i);
        break;
      }
    }
  }

  // Bullets and Asteroids
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      if (isColliding(bullets[i], asteroids[j])) {
        handleAsteroidsHit(j);
        bullets.splice(i, 1);
        console.log("score: ", score);
        break;
      }
    }
  }
}

function isColliding(a, b) {
  let d = dist(a.position.x, a.position.y, b.position.x, b.position.y);
  return d < a.size / 2 + b.size / 2;
}

function handleAsteroidsHit(index) {
  if (asteroids[index].type == "large") {
    score += 20;
    let hitPos = asteroids[index].position.copy();
    asteroids.splice(index, 1);
    asteroids.push(
      new Asteroid(35, hitPos.copy(), p5.Vector.random2D().mult(2)),
    );
    asteroids.push(
      new Asteroid(35, hitPos.copy(), p5.Vector.random2D().mult(2)),
    );
  } else if (asteroids[index].type == "medium") {
    score += 50;
    let hitPos = asteroids[index].position.copy();
    asteroids.splice(index, 1);
    asteroids.push(
      new Asteroid(25, hitPos.copy(), p5.Vector.random2D().mult(3.5)),
    );
    asteroids.push(
      new Asteroid(25, hitPos.copy(), p5.Vector.random2D().mult(3.5)),
    );
  } else if (asteroids[index].type == "small") {
    score += 100;
    asteroids.splice(index, 1);
  }
}

function handleSaucersHit(index) {}

function scoreManager() {
  // Spawn a saucer on every 1,500 score
  if (score >= lastSpawnSaucerScore + saucerSpawnInterval) {
    lastSpawnSaucerScore += saucerSpawnInterval;
    saucers.push(
      new Saucer(
        50,
        createVector(random(width), random(height)),
        createVector(1, 0),
      ),
    );
  }

  // Gain an extra live on every 10,000 score
  if (score >= lastLifeGainScore + extraLifeInterval) {
    lastLifeGainScore += extraLifeInterval;
    player.gainExtraLife();
  }
}

function keyPressed() {
  // fire bullets
  if (keyCode === 32) {
    bullets.push(new Bullet(player.position, player.angle));
  }
}

function drawUI() {
  push();
  textSize(30);
  fill("red");
  text("Score: " + score, width / 2 - 60, 50);
  text("Lives: " + player.lives, width / 2 + 150, 50);
  pop();
}
