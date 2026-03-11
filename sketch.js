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
let startAsteroidsNumber = 8;
let saucerFireTimer = 0;
let saucerFireInterval = 0.5;
let saucerAimOffset = 0;
let screenShakeDuration = 0.5;
let shakeIntensity = 5;
let isShaking = false;

let hasStarted = false;

function setup() {
  createCanvas(800, 800);
  player = new Player(createVector(width / 2, height / 2));
  asteroids = makeAsteroids(startAsteroidsNumber, 50);
}

function draw() {
  background(0);

  if (!hasStarted) {
    asteroidsManager();
    drawMainMenu();
    return;
  }

  if (isShaking) {
    screenShake();
  }

  bulletsManager();

  asteroidsManager();

  saucersManager();

  // game ends when the player loses all their lives
  if (player.isGameOver) {
    drawGameOverUI();
  } else {
    player.update();
    player.draw();
  }

  levelManager();

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
        isShaking = true;
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
        isShaking = true;
        break;
      }
    }
  }

  // Player and Saucerbullets
  if (!player.isInvincible) {
    for (let i = saucerBullets.length - 1; i >= 0; i--) {
      if (isColliding(player, saucerBullets[i])) {
        player.loseLife();
        saucerBullets.splice(i, 1);
        isShaking = true;
        break;
      }
    }
  }

  // Playerbullets and Asteroids
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

  // playerbullets and Saucers
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = saucers.length - 1; j >= 0; j--) {
      if (isColliding(bullets[i], saucers[j])) {
        handleSaucersHit(j, true);
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
      new Asteroid(35, hitPos.copy(), p5.Vector.random2D().mult(1.5)),
    );
    asteroids.push(
      new Asteroid(35, hitPos.copy(), p5.Vector.random2D().mult(1.5)),
    );
  } else if (asteroids[index].type == "medium") {
    killedByPlayer ? (score += 50) : (score += 0);
    let hitPos = asteroids[index].position.copy();
    asteroids.splice(index, 1);
    asteroids.push(
      new Asteroid(25, hitPos.copy(), p5.Vector.random2D().mult(2)),
    );
    asteroids.push(
      new Asteroid(25, hitPos.copy(), p5.Vector.random2D().mult(2)),
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

      // small saucers' aim gets better when score increases
      let aimRange = 0.3 - score / 50000;
      if (aimRange < 0) {
        aimRange = 0;
      }
      saucer.type == "large"
        ? (saucerAimOffset = random(-1, 1))
        : (saucerAimOffset = random(-aimRange, aimRange));
      saucerBullets.push(new Bullet(saucer.position, angle + saucerAimOffset));
    }
  }
}

function scoreManager() {
  // Spawn a saucer for every 1,500 score
  if (score >= lastSpawnSaucerScore + saucerSpawnInterval) {
    lastSpawnSaucerScore += saucerSpawnInterval;
    let randomSaucerSize = random() < 0.8 ? 50 : 30;
    let randomX = random() < 0.5 ? -2 : 2;
    saucers.push(
      new Saucer(
        randomSaucerSize,
        createVector(0, random(height)),
        createVector(randomX, 0),
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
  if (!player.isGameOver) {
    if (keyCode === 32) {
      bullets.push(new Bullet(player.position, player.angle));
    }
  }
}

function screenShake() {
  screenShakeDuration -= deltaTime / 1000;
  if (screenShakeDuration >= 0) {
    let offsetX = (Math.random() - 0.5) * shakeIntensity;
    let offsetY = (Math.random() - 0.5) * shakeIntensity;
    translate(offsetX, offsetY);
  } else {
    translate(0, 0);
    screenShakeDuration = 0.3;
    isShaking = false;
  }
}

function bulletsManager() {
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
    saucerBullet.draw(true);
  }

  for (let i = saucerBullets.length - 1; i >= 0; i--) {
    if (saucerBullets[i].isDead) {
      saucerBullets.splice(i, 1);
    }
  }
}

function asteroidsManager() {
  for (let asteroid of asteroids) {
    asteroid.update();
    asteroid.draw();
  }
}

function saucersManager() {
  for (let saucer of saucers) {
    saucer.update();
    saucer.draw();
  }
}

function levelManager() {
  // level system: when all asteroids are cleared, spawn a new wave with a few extra asteroids
  if (asteroids.length == 0) {
    asteroids = makeAsteroids(startAsteroidsNumber + gameLevel * 2, 50);
    gameLevel++;
  }
}

function drawMainMenu() {
  push();
  textSize(50);
  fill("Grey");
  text("Asteroid", width / 2 - 150, height / 2);
  pop();
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
  fill("Grey");
  text("GAME OVER", width / 2 - 150, height / 2);
  pop();
}
