p5.disableFriendlyErrors = true;

let player;
let asteroids = [];
let bullets = [];
let saucers = [];
let saucerBullets = [];
let score = 0;
let lastSpawnSaucerScore = 0;
let saucerSpawnInterval = 1500;
let lastLifeGainScore = 0;
let extraLifeInterval = 10000;
let gameLevel = 1;
let startAsteroidsNumber = 1;
let saucerFireTimer = 0;
let saucerFireInterval = 0.5;

function setup() {
  createCanvas(800, 800);
  player = new Player(createVector(width / 2, height / 2));
  asteroids = makeAsteroids(startAsteroidsNumber, 50);
  saucers.push(
    new Saucer(
      50,
      createVector(random(width), random(height)),
      createVector(1, 0),
    ),
  );
}

function draw() {
  background(0);

  for (let bullet of bullets) {
    bullet.update();
    bullet.draw();
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].isDead) {
      bullets.splice(i, 1);
    }
  }

  for (let saucerBullet of saucerBullets) {
    saucerBullet.update();
    saucerBullet.draw();
  }

  for (let i = saucerBullets.length - 1; i >= 0; i--) {
    if (saucerBullets[i].isDead) {
      saucerBullets.splice(i, 1);
    }
  }

  for (let asteroid of asteroids) {
    asteroid.update();
    asteroid.draw();
  }

  for (let saucer of saucers) {
    saucer.update();
    saucer.draw();
  }

  if (player.isGameOver) {
    drawGameOverUI();
  } else {
    player.update();
    player.draw();
  }

  if (asteroids.length == 0) {
    asteroids = makeAsteroids(startAsteroidsNumber + gameLevel * 2, 50);
    gameLevel++;
  }

  saucerFireBullets();

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
        handleAsteroidsHit(i, true);
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

  // Player and Saucers
  if (!player.isInvincible) {
    for (let i = saucerBullets.length - 1; i >= 0; i--) {
      if (isColliding(player, saucerBullets[i])) {
        player.loseLife();
        saucerBullets.splice(i, 1);
        break;
      }
    }
  }

  // Bullets and Asteroids
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      if (isColliding(bullets[i], asteroids[j])) {
        handleAsteroidsHit(j, true);
        bullets.splice(i, 1);
        console.log("score: ", score);
        break;
      }
    }
  }

  // SaucerBullets and Asteroids
  for (let i = saucerBullets.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      if (isColliding(saucerBullets[i], asteroids[j])) {
        handleAsteroidsHit(j, false);
        saucerBullets.splice(i, 1);
        break;
      }
    }
  }

  // Saucers and Asteroids
  for (let i = saucers.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      if (isColliding(saucers[i], asteroids[j])) {
        handleAsteroidsHit(j, false);
        saucers.splice(i, 1);
        break;
      }
    }
  }
}

function isColliding(a, b) {
  let d = dist(a.position.x, a.position.y, b.position.x, b.position.y);
  return d < a.size / 2 + b.size / 2;
}

function handleAsteroidsHit(index, killedByPlayer) {
  if (asteroids[index].type == "large") {
    killedByPlayer ? (score += 20) : (score += 0);
    let hitPos = asteroids[index].position.copy();
    asteroids.splice(index, 1);
    asteroids.push(
      new Asteroid(35, hitPos.copy(), p5.Vector.random2D().mult(2)),
    );
    asteroids.push(
      new Asteroid(35, hitPos.copy(), p5.Vector.random2D().mult(2)),
    );
  } else if (asteroids[index].type == "medium") {
    killedByPlayer ? (score += 50) : (score += 0);
    let hitPos = asteroids[index].position.copy();
    asteroids.splice(index, 1);
    asteroids.push(
      new Asteroid(25, hitPos.copy(), p5.Vector.random2D().mult(3.5)),
    );
    asteroids.push(
      new Asteroid(25, hitPos.copy(), p5.Vector.random2D().mult(3.5)),
    );
  } else if (asteroids[index].type == "small") {
    killedByPlayer ? (score += 100) : (score += 0);
    asteroids.splice(index, 1);
  }
}

function handleSaucersHit(index) {
  if (saucers[index].type == "large") {
    score += 200;
    saucers.splice(index, 1);
  } else if (saucers[index].type == "small") {
    score += 1000;
    saucers.splice(index, 1);
  }
}

function saucerFireBullets() {
  for (let saucer of saucers) {
    saucerFireTimer += deltaTime / 1000;
    if (saucerFireTimer >= saucerFireInterval) {
      saucerFireTimer = 0;
      let dy = player.position.y - saucer.position.y;
      let dx = player.position.x - saucer.position.x;
      let angle = atan2(dy, dx);
      saucerBullets.push(new Bullet(saucer.position, angle));
    }
  }
}

function scoreManager() {
  // Spawn a saucer for every 1,500 score
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

  // Gain an extra live for every 10,000 score
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

function drawGameOverUI() {
  push();
  textSize(50);
  fill("White");
  text("GAME OVER", width / 2 - 150, height / 2);
  pop();
}
