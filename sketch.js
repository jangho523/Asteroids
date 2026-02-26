let player;
let largeAsteroids = [];
let bullets = [];

function setup() {
  createCanvas(800, 800);
  player = new Player(createVector(width / 2, height / 2));
  largeAsteroids = makeAsteroids(30);
}

function draw() {
  background(0);
  
  for (let asteroid of largeAsteroids) {
    asteroid.update();
    asteroid.draw();
  }

  for (let bullet of bullets) {
    bullet.update();
    bullet.draw();
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

function checkCollisions() {
  // Player and Asteroids
  for (let i = largeAsteroids.length - 1; i >= 0; i--) {
    if (isColliding(player, largeAsteroids[i])) {
      if (!player.isInvincible) {
        player.loseLife();
        largeAsteroids.splice(i, 1);
        break;
      }
    }
  }

  // Bullets and Asteroids
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = largeAsteroids.length - 1; j >= 0; j--) {
      if (isColliding(bullets[i], largeAsteroids[j])) {
        bullets.splice(i, 1);
        largeAsteroids.splice(j, 1);
        break;
      }
    }
  }
}

function isColliding(a, b) {
  let d = dist(a.position.x, a.position.y, b.position.x, b.position.y);
  return d < a.size / 2 + b.size / 2;
}

function keyPressed() {
  // fire bullets
  if (keyCode === 32) {
    bullets.push(new Bullet(player.position, player.angle));
  }
}
