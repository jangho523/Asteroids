class Player extends BaseActor {
  constructor(position) {
    super(60, position, createVector(0, 0));
    this.rotateSpeed = 0.1;
    this.angle = -PI / 2;
    this.friction = 0.95;
    this.downHeld = false;
    this.lives = 3;
    this.isInvincible = true;
    this.invincibleTimer = 0;
    this.isGameOver = false;
    this.isMoving = false;

    this.hyperspaceTimer = 0;
    this.isHyperjumping = false;
    this.hasJumped = false;

    this.isRespawning = false;
    this.respawnTimer = 0;
    this.respawnTime = 1.5;
  }

  update() {
    if (!this.isGameOver) {
      if (!this.isHyperjumping && !this.isRespawning) {
        this.handleInput();
      }

      this.velocity.mult(this.friction);

      super.update();

      this.calculateInvincibleTime();

      this.calculateHyperjumpTime();

      this.calculateRespawnTime();
    }
  }

  handleInput() {
    // Rotation
    if (keyIsDown(LEFT_ARROW)) {
      this.angle -= this.rotateSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.angle += this.rotateSpeed;
    }

    // Acceleration
    if (keyIsDown(UP_ARROW)) {
      let force = p5.Vector.fromAngle(this.angle);
      force.mult(0.3);
      this.velocity.add(force);
      this.isMoving = true;
      if (
        !engineSFX.isPlaying() &&
        !this.isRespawning &&
        !this.isHyperjumping
      ) {
        engineSFX.loop();
      }
    } else {
      this.isMoving = false;
      engineSFX.stop();
    }

    // HyperJump
    if (keyIsDown(DOWN_ARROW) && !this.downHeld) {
      if (!this.isHyperjumping && !this.isRespawning) {
        this.startHyperspaceJump();
      }
    }
    if (!keyIsDown(DOWN_ARROW)) {
      this.downHeld = false;
    }
  }

  calculateHyperjumpTime() {
    if (this.isHyperjumping) {
      this.hyperspaceTimer += deltaTime / 1000;

      if (!this.hasJumped && this.hyperspaceTimer >= 0.25) {
        this.hasJumped = true;
        this.position.x = random(width);
        this.position.y = random(height);
      }

      if (this.hyperspaceTimer >= 0.5) {
        this.endHyperspaceJump();
      }
    }
  }

  startHyperspaceJump() {
    engineSFX.stop();
    this.isHyperjumping = true;
    this.velocity.set(0);
    this.downHeld = true;
    this.isMoving = false;
    hyperspaceSFX.play();
  }

  endHyperspaceJump() {
    this.isHyperjumping = false;
    this.hyperspaceTimer = 0;
    this.hasJumped = false;
  }

  loseLife() {
    if (!this.isInvincible && !this.isRespawning) {
      if (this.lives > 0) {
        --this.lives;
        this.isRespawning = true;
        this.isMoving = false;
        engineSFX.stop();
      }
    }

    if (this.lives == 0) {
      this.death();
    }
  }

  bulletKnockback() {
    let force = p5.Vector.fromAngle(this.angle + PI);
    force.mult(0.3);
    this.velocity.add(force);
  }

  calculateInvincibleTime() {
    if (this.isInvincible) {
      this.invincibleTimer += deltaTime / 1000;
      if (this.invincibleTimer >= 2) {
        this.isInvincible = false;
        this.invincibleTimer = 0;
      }
    }
  }

  calculateRespawnTime() {
    if (this.isRespawning) {
      this.respawnTimer += deltaTime / 1000;

      if (this.respawnTimer >= this.respawnTime) {
        this.isRespawning = false;
        this.respawnTimer = 0;

        this.position.x = width / 2;
        this.position.y = height / 2;
        this.velocity.set(0);
        this.angle = -PI / 2;

        this.isInvincible = true;
        this.invincibleTimer = 0;
      }
    }
  }

  gainExtraLife() {
    this.lives++;
  }

  death() {
    console.log("Game Over");
    this.isGameOver = true;
  }

  draw() {
    if (this.isRespawning) {
      return;
    }
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle + HALF_PI);
    imageMode(CENTER);

    let currentScale = 1;

    if (this.isHyperjumping) {
      if (this.hyperspaceTimer < 0.25) {
        currentScale = 1 - this.hyperspaceTimer / 0.25;
      } else {
        currentScale = (this.hyperspaceTimer - 0.25) / 0.25;
      }
    }

    scale(currentScale);

    if (this.isInvincible) {
      if (frameCount % 8 < 4) {
        if (!this.isMoving) {
          image(shipImages[0], 0, 0, this.size, this.size);
        } else {
          if (frameCount % 6 < 3) {
            image(shipImages[1], 0, 0, this.size, this.size);
          } else {
            image(shipImages[2], 0, 0, this.size, this.size);
          }
        }
      }
    } else {
      if (!this.isMoving) {
        image(shipImages[0], 0, 0, this.size, this.size);
      } else {
        if (frameCount % 6 < 3) {
          image(shipImages[1], 0, 0, this.size, this.size);
        } else {
          image(shipImages[2], 0, 0, this.size, this.size);
        }
      }
    }

    pop();
  }
}
