p5.disableFriendlyErrors = true;

// Game Setting valuables
let gameState;
let score = 0;
let gameLevel = 1;
let startAsteroidsNumber = 6;
let lastSpawnSaucerScore = 0;
let saucerSpawnInterval = 1500;
let lastLifeGainScore = 0;
let extraLifeInterval = 10000;

// Object valuables
let player;
let asteroids = [];
let bullets = [];
let saucers = [];
let saucerBullets = [];

// Saucer shooting valuables
let saucerFireTimer = 0;
let saucerFireInterval = 0.5;
let saucerAimOffset = 0;
let saucerPredictAimScore = 15000;

// UI Related valuable
let isLevelupTextShowing = false;
let levelupTextTimer = 0;
let alpha = 0;
let fadeAmount = 1;

// Explosion Particle valualbes
let particles = [];

// Screen shake valuables
let screenShakeDuration = 0.5;
let shakeIntensity = 5;
let isShaking = false;

// Leaderboard valuables
let leaderboard = [];
let currentName = "";
let input;

// Buttons
let playButton = {
  x: 300,
  y: 450,
  w: 200,
  h: 60,
};
let restartButton = {
  x: 180,
  y: 520,
  w: 200,
  h: 50,
};
let lbButtonOnMainmenu = {
  x: 300,
  y: 550,
  w: 200,
  h: 60,
};
let lbButtonOnGameover = {
  x: 430,
  y: 520,
  w: 200,
  h: 50,
};

// Sprites preload
let shipImages = [];
let asteroidImages = [];
let saucerImage;
let playerBulletImages = [];
let saucerBulletImages = [];
let explosionImages = [];
let backgroundImage;

// Audio preload
let explosionSFX;
let shootSFX;
let saucerShootSFX;
let hyperspaceSFX;
let saucerPresenceSFX;
let engineSFX;
let mainmenuBGM;
let playingBGM;

// Font preload
let fontBoldPixels;

function preload() {
  // Sprites preload
  shipImages[0] = loadImage("assets/sprites/ship-a1.png");
  shipImages[1] = loadImage("assets/sprites/ship-a2.png");
  shipImages[2] = loadImage("assets/sprites/ship-a3.png");
  asteroidImages[0] = loadImage("assets/sprites/big-a.png");
  asteroidImages[1] = loadImage("assets/sprites/big-b.png");
  asteroidImages[2] = loadImage("assets/sprites/big-c.png");
  saucerImage = loadImage("assets/sprites/enemy-ship.png");
  playerBulletImages[0] = loadImage("assets/sprites/player-bullet1.png");
  playerBulletImages[1] = loadImage("assets/sprites/player-bullet2.png");
  saucerBulletImages[0] = loadImage("assets/sprites/saucer-bullet1.png");
  saucerBulletImages[1] = loadImage("assets/sprites/saucer-bullet2.png");
  saucerBulletImages[2] = loadImage("assets/sprites/saucer-bullet3.png");
  saucerBulletImages[3] = loadImage("assets/sprites/saucer-bullet4.png");
  explosionImages[0] = loadImage("assets/sprites/explosions-a1.png");
  explosionImages[1] = loadImage("assets/sprites/explosions-a2.png");
  explosionImages[2] = loadImage("assets/sprites/explosions-a3.png");
  explosionImages[3] = loadImage("assets/sprites/explosions-a4.png");
  explosionImages[4] = loadImage("assets/sprites/explosions-a5.png");
  explosionImages[5] = loadImage("assets/sprites/explosions-a6.png");
  backgroundImage = loadImage("assets/sprites/background.png");

  // Sound preload
  explosionSFX = loadSound("assets/audio/Explosion.wav");
  shootSFX = loadSound("assets/audio/Shoot.wav");
  saucerShootSFX = loadSound("assets/audio/Shoot.wav");
  hyperspaceSFX = loadSound("assets/audio/Hyperspace.wav");
  saucerPresenceSFX = loadSound("assets/audio/SaucerPresence.wav");
  engineSFX = loadSound("assets/audio/Engine.mp3");
  mainmenuBGM = loadSound("assets/audio/Mainmenu.ogg");
  playingBGM = loadSound("assets/audio/Playing.ogg");

  // font preload
  fontBoldPixels = loadFont("assets/font/BoldPixels.otf");
}

function setup() {
  createCanvas(800, 800);
  textFont(fontBoldPixels);
  noSmooth();
  gameState = "gameover";
  player = new Player(createVector(width / 2, height / 2));
  asteroids = makeAsteroids(startAsteroidsNumber, 50);

  input = createInput("");
  input.position(width / 2 + 30, height / 2 + 50);
  input.hide();

  leaderboard = getItem("leaderboard");
  if (leaderboard == null) {
    leaderboard = [];
  }

  explosionSFX.setVolume(0.1);
  shootSFX.setVolume(0.1);
  saucerShootSFX.setVolume(0.1);
  hyperspaceSFX.setVolume(1);
  saucerPresenceSFX.setVolume(0.5);
  engineSFX.setVolume(0.4);
  mainmenuBGM.setVolume(0.15);
  playingBGM.setVolume(0.15);
}

function draw() {
  background(0);
  playBGM();
  image(backgroundImage, 0, 0, width, height);
  if (gameState == "mainmenu") {
    drawMainMenu();
  } else if (gameState == "playing") {
    runGame();
  } else if (gameState == "gameover") {
    drawGameOverUI();
  } else if (gameState == "leaderboard") {
    drawLeaderboard();
  }
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
  if (canPlayerCollide()) {
    for (let i = asteroids.length - 1; i >= 0; i--) {
      if (isColliding(player, asteroids[i])) {
        spawnParticle(player.position.copy());
        player.loseLife();
        handleAsteroidsHit(i, true);
        isShaking = true;
        break;
      }
    }
  }

  // Player and Saucers
  if (canPlayerCollide()) {
    for (let i = saucers.length - 1; i >= 0; i--) {
      if (isColliding(player, saucers[i])) {
        player.loseLife();
        spawnParticle(player.position.copy());
        spawnParticle(saucers[i].position.copy());
        handleSaucersHit(i);
        isShaking = true;
        saucerPresenceSFX.stop();
        break;
      }
    }
  }

  // Player and Saucerbullets
  if (canPlayerCollide()) {
    for (let i = saucerBullets.length - 1; i >= 0; i--) {
      if (isColliding(player, saucerBullets[i])) {
        spawnParticle(player.position.copy());
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
        spawnParticle(bullets[i].position);
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
        spawnParticle(saucers[j].position.copy());
        handleSaucersHit(j, true);
        bullets.splice(i, 1);
        saucerPresenceSFX.stop();
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
        spawnParticle(saucerBullets[i].position);
        saucerBullets.splice(i, 1);
        break;
      }
    }
  }

  // Saucers and Asteroids
  for (let i = saucers.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      if (isColliding(saucers[i], asteroids[j])) {
        spawnParticle(saucers[i].position.copy());
        handleAsteroidsHit(j, false);
        saucers.splice(i, 1);
        saucerPresenceSFX.stop();
        break;
      }
    }
  }
}

function canPlayerCollide() {
  return !player.isInvincible && !player.isHyperjumping && !player.isRespawning;
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
      let targetX = player.position.x;
      let targetY = player.position.y;

      let isSaucerPredictAimOn = false;
      // small saucer predict aim mode
      if (saucer.type == "small" && score >= saucerPredictAimScore) {
        isSaucerPredictAimOn = true;
        targetX = player.position.x + player.velocity.x * 40;
        targetY = player.position.y + player.velocity.y * 40;
        saucerAimOffset = 0;
      }

      let dx = targetX - saucer.position.x;
      let dy = targetY - saucer.position.y;
      let angle = atan2(dy, dx);

      if (saucer.type == "large") {
        saucerAimOffset = random(-1, 1);
      } else {
        //small saucers' aim gets better when score increases
        if (!isSaucerPredictAimOn) {
          let aimRange = 0.3 - score / 50000;
          if (aimRange < 0) {
            aimRange = 0;
          }
          saucerAimOffset = random(-aimRange, aimRange);
        }
      }
      saucerBullets.push(
        new Bullet(saucer.position.copy(), angle + saucerAimOffset, true),
      );
      saucerShootSFX.play(0, 2);
    }
  }
}

function scoreManager() {
  // Spawn a saucer for every 1,500 score
  if (score >= lastSpawnSaucerScore + saucerSpawnInterval) {
    lastSpawnSaucerScore += saucerSpawnInterval;
    let randomSaucerSize = random() < 0.8 ? 70 : 50;
    let randomX = random() < 0.5 ? -2 : 2;
    saucers.push(
      new Saucer(
        randomSaucerSize,
        createVector(0, random(height)),
        createVector(randomX, 0),
      ),
    );
    saucerPresenceSFX.loop();
  }

  // Gain an extra live for every 10,000 score
  if (score >= lastLifeGainScore + extraLifeInterval) {
    lastLifeGainScore += extraLifeInterval;
    player.gainExtraLife();
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

function objectManager() {
  // Update and draw Player's bullets
  for (let bullet of bullets) {
    bullet.update();
    bullet.draw();
  }

  // Remove Player's bullets if their lifespan is over or they are collided
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].isDead) {
      bullets.splice(i, 1);
    }
  }

  // Update and draw Saucers' bullets
  for (let saucerBullet of saucerBullets) {
    saucerBullet.update();
    saucerBullet.draw(true);
  }

  // Remove Saucers' bullets if their lifespan is over or they are collided
  for (let i = saucerBullets.length - 1; i >= 0; i--) {
    if (saucerBullets[i].isDead) {
      saucerBullets.splice(i, 1);
    }
  }

  // Update and draw Asteroids
  for (let asteroid of asteroids) {
    asteroid.update();
    asteroid.draw();
  }

  // Update and draw Saucers
  for (let saucer of saucers) {
    saucer.update();
    saucer.draw();
  }

  // Update and draw Player
  player.update();
  player.draw();

  // Update and draw Explosion Particles
  for (let particle of particles) {
    particle.update();
    particle.draw();
  }

  // Remove particle effect when it finishes playing
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].isDead) {
      particles.splice(i, 1);
    }
  }

  // Check if player is dead
  if (player.isGameOver && gameState !== "gameover") {
    gameState = "gameover";
  }
}

function levelManager() {
  // level system: when all asteroids are cleared, spawn a new wave with a few extra asteroids
  if (asteroids.length == 0) {
    player.isInvincible = true;
    asteroids = makeAsteroids(startAsteroidsNumber + gameLevel * 2, 50);

    gameLevel++;
    isLevelupTextShowing = true;
  }
}

function keyPressed() {
  // fire bullets
  if (gameState == "playing" && !player.isRespawning) {
    if (keyCode === 32) {
      bullets.push(new Bullet(player.position, player.angle, false));
      shootSFX.play();
      player.bulletKnockback();
    }
  } else if (gameState == "leaderboard") {
    if (keyCode === 32) {
      resetGame();
      gameState = "mainmenu";
    }
  }
}

function mousePressed() {
  if (gameState == "mainmenu") {
    if (
      mouseX > playButton.x &&
      mouseX < playButton.x + playButton.w &&
      mouseY > playButton.y &&
      mouseY < playButton.y + playButton.h
    ) {
      gameState = "playing";
    } else if (
      mouseX > lbButtonOnMainmenu.x &&
      mouseX < lbButtonOnMainmenu.x + lbButtonOnMainmenu.w &&
      mouseY > lbButtonOnMainmenu.y &&
      mouseY < lbButtonOnMainmenu.y + lbButtonOnMainmenu.h
    ) {
      gameState = "leaderboard";
    }
  } else if (gameState == "gameover") {
    if (
      mouseX > restartButton.x &&
      mouseX < restartButton.x + restartButton.w &&
      mouseY > restartButton.y &&
      mouseY < restartButton.y + restartButton.h
    ) {
      calculateLeaderboard();
      resetGame();
      gameState = "playing";
    } else if (
      mouseX > lbButtonOnGameover.x &&
      mouseX < lbButtonOnGameover.x + lbButtonOnGameover.w &&
      mouseY > lbButtonOnGameover.y &&
      mouseY < lbButtonOnGameover.y + lbButtonOnGameover.h
    ) {
      calculateLeaderboard();
      gameState = "leaderboard";
    }
  }
}

function runGame() {
  input.hide();
  if (isShaking) {
    screenShake();
  }

  objectManager();

  levelManager();

  saucerFireBullets();

  checkCollisions();

  scoreManager();

  drawUI();
}

function drawMainMenu() {
  input.hide();
  push();

  for (let asteroid of asteroids) {
    asteroid.update();
    asteroid.draw();
  }
  textAlign(CENTER);

  push();
  textSize(100);
  fill("white");
  drawingContext.shadowOffsetX = 10;
  drawingContext.shadowOffsetY = 10;
  drawingContext.shadowBlur = 2;
  drawingContext.shadowColor = "black";
  text("ASTEROIDS", width / 2, height / 2 - 100);
  pop();

  // Change button color if mouse hovers on the play button
  if (
    mouseX > playButton.x &&
    mouseX < playButton.x + playButton.w &&
    mouseY > playButton.y &&
    mouseY < playButton.y + playButton.h
  ) {
    fill("grey");
  } else {
    fill("white");
  }
  noStroke();
  push();

  drawingContext.shadowOffsetX = 10;
  drawingContext.shadowOffsetY = 10;
  drawingContext.shadowBlur = 2;
  drawingContext.shadowColor = "black";
  rect(playButton.x, playButton.y, playButton.w, playButton.h, 100);
  pop();
  textSize(50);
  fill("Black");
  text("PLAY", width / 2, height / 2 + 93);

  if (
    mouseX > lbButtonOnMainmenu.x &&
    mouseX < lbButtonOnMainmenu.x + lbButtonOnMainmenu.w &&
    mouseY > lbButtonOnMainmenu.y &&
    mouseY < lbButtonOnMainmenu.y + lbButtonOnMainmenu.h
  ) {
    fill("grey");
  } else {
    fill("white");
  }
  noStroke();
  push();

  drawingContext.shadowOffsetX = 10;
  drawingContext.shadowOffsetY = 10;
  drawingContext.shadowBlur = 2;
  drawingContext.shadowColor = "black";
  rect(
    lbButtonOnMainmenu.x,
    lbButtonOnMainmenu.y,
    lbButtonOnMainmenu.w,
    lbButtonOnMainmenu.h,
    100,
  );
  pop();
  fill("Black");
  textSize(30);
  text("LEADERBOARD", width / 2, height / 2 + 188);

  textSize(20);
  fill("grey");
  textAlign(RIGHT, BOTTOM);
  text("By Jangho Son", width - 20, height - 20);

  pop();
}

function drawUI() {
  push();
  textAlign(CENTER);
  drawingContext.shadowOffsetX = 10;
  drawingContext.shadowOffsetY = 10;
  drawingContext.shadowBlur = 2;
  drawingContext.shadowColor = "black";
  textSize(30);
  fill("white");
  text("Level: " + gameLevel, 120, 50);
  text("Score: " + score, width / 2, 50);
  text("Lives: " + player.lives, 680, 50);

  if (isLevelupTextShowing) {
    levelupTextTimer += deltaTime / 1000;
    textSize(70);
    alpha += fadeAmount;
    if (alpha <= 0 || alpha >= 255) {
      fadeAmount *= -1;
    }
    fill();
    text("Level Up!", width / 2, height / 2);
    if (levelupTextTimer >= 1.5) {
      isLevelupTextShowing = false;
      levelupTextTimer = 0;
    }
  }
  pop();
}

function drawGameOverUI() {
  drawGameOverObject();

  push();
  textSize(80);
  textAlign(CENTER);
  push();
  drawingContext.shadowOffsetX = 10;
  drawingContext.shadowOffsetY = 10;
  drawingContext.shadowBlur = 2;
  drawingContext.shadowColor = "black";
  fill("white");
  text("GAME OVER", width / 2, height / 2 - 60);
  textSize(40);
  text("Your Score: " + score, width / 2, height / 2 + 20);

  text("Your Name: ", width / 2 - 80, height / 2 + 72);
  pop();
  input.show();
  input.position(width / 2 + 30, height / 2 + 53);

  if (
    mouseX > restartButton.x &&
    mouseX < restartButton.x + restartButton.w &&
    mouseY > restartButton.y &&
    mouseY < restartButton.y + restartButton.h
  ) {
    fill("grey");
  } else {
    fill("white");
  }
  noStroke();
  push();
  drawingContext.shadowOffsetX = 10;
  drawingContext.shadowOffsetY = 10;
  drawingContext.shadowBlur = 2;
  drawingContext.shadowColor = "black";
  rect(restartButton.x, restartButton.y, restartButton.w, restartButton.h, 100);
  pop();
  if (
    mouseX > lbButtonOnGameover.x &&
    mouseX < lbButtonOnGameover.x + lbButtonOnGameover.w &&
    mouseY > lbButtonOnGameover.y &&
    mouseY < lbButtonOnGameover.y + lbButtonOnGameover.h
  ) {
    fill("grey");
  } else {
    fill("white");
  }
  textSize(36);
  noStroke();
  push();
  drawingContext.shadowOffsetX = 10;
  drawingContext.shadowOffsetY = 10;
  drawingContext.shadowBlur = 2;
  drawingContext.shadowColor = "black";
  rect(
    lbButtonOnGameover.x,
    lbButtonOnGameover.y,
    lbButtonOnGameover.w,
    lbButtonOnGameover.h,
    100,
  );
  pop();

  fill("black");
  text(
    "RESTART",
    restartButton.x + 100,
    restartButton.y + restartButton.h - 16.5,
  );

  fill("black");
  textSize(30);
  text(
    "LEADERBOARD",
    lbButtonOnGameover.x + 100,
    lbButtonOnGameover.y + lbButtonOnGameover.h - 16.5,
  );

  pop();
}

function drawLeaderboard() {
  input.hide();
  drawGameOverObject();
  push();
  textAlign(CENTER, CENTER);
  drawingContext.shadowOffsetX = 10;
  drawingContext.shadowOffsetY = 10;
  drawingContext.shadowBlur = 2;
  drawingContext.shadowColor = "black";
  textSize(65);
  fill("white");
  text("LEADERBOARD", width / 2, height / 2 - 250);

  textAlign(LEFT, BASELINE);
  textSize(40);

  for (let i = 0; i < 5; i++) {
    text(i + 1 + ".", width / 2 - 180, height / 2 - 100 + i * 50);

    if (leaderboard[i]) {
      text(leaderboard[i].name, width / 2 - 130, height / 2 - 100 + i * 50);
      text(leaderboard[i].score, width / 2 + 80, height / 2 - 100 + i * 50);
    }
  }

  textAlign(CENTER, CENTER);
  textSize(40);
  text("PRESS SPACE FOR MAINMENU", width / 2, height / 2 + 250);
  pop();
}

function drawGameOverObject() {
  if (isShaking) {
    screenShake();
  }
  // Update and draw Saucers' bullets
  for (let saucerBullet of saucerBullets) {
    saucerBullet.update();
    saucerBullet.draw(true);
  }

  // Remove Saucers' bullets if their lifespan is over or they are collided
  for (let i = saucerBullets.length - 1; i >= 0; i--) {
    if (saucerBullets[i].isDead) {
      saucerBullets.splice(i, 1);
    }
  }

  // Update and draw Asteroids
  for (let asteroid of asteroids) {
    asteroid.update();
    asteroid.draw();
  }

  // Update and draw Saucers
  for (let saucer of saucers) {
    saucer.update();
    saucer.draw();
  }

  // Update and draw Explosion Particles
  for (let particle of particles) {
    particle.update();
    particle.draw();
  }

  // Remove particle effect when it finishes playing
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].isDead) {
      particles.splice(i, 1);
    }
  }
}

function calculateLeaderboard() {
  currentName = input.value();

  if (currentName == "") {
    currentName = "Anonymous";
  }

  leaderboard.push({
    name: currentName,
    score: score,
  });

  leaderboard.sort((a, b) => b.score - a.score);

  leaderboard = leaderboard.slice(0, 5);

  storeItem("leaderboard", leaderboard);
}

function spawnParticle(position) {
  particles.push(new ParticleManager(position.copy(), 50));
  explosionSFX.play();
}

function playBGM() {
  if (gameState == "mainmenu" || gameState == "leaderboard") {
    if (!mainmenuBGM.isPlaying()) {
      playingBGM.stop();
      mainmenuBGM.loop();
    }
  } else if (gameState == "playing") {
    if (!playingBGM.isPlaying()) {
      mainmenuBGM.stop();
      playingBGM.loop();
    }
  } else {
    engineSFX.stop();
    saucerPresenceSFX.stop();
    mainmenuBGM.stop();
    playingBGM.stop();
  }
}

function resetGame() {
  gameLevel = 1;
  lastSpawnSaucerScore = 0;
  lastLifeGainScore = 0;
  saucerFireTimer = 0;
  isShaking = false;
  score = 0;
  player = new Player(createVector(width / 2, height / 2));
  asteroids = makeAsteroids(startAsteroidsNumber, 50);
  bullets = [];
  saucers = [];
  saucerBullets = [];
  particles = [];
}
