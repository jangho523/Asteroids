let player;
let asteroids = [];
let bullets = [];
let score = 0;

function setup() {
  createCanvas(800, 800);
  player = new Player(createVector(width / 2, height / 2));
  asteroids = makeAsteroids(30, 50);
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

  player.update();
  player.draw();

  checkCollisions();
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
  for (let i = asteroids.length - 1; i >= 0; i--) {
    if (isColliding(player, asteroids[i])) {
      if (!player.isInvincible) {
        player.loseLife();
        handleAsteroidsHit(i);
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

function keyPressed() {
  // fire bullets
  if (keyCode === 32) {
    bullets.push(new Bullet(player.position, player.angle));
  }
}
