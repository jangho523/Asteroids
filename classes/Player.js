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
  }

  update() {
    if (!this.isGameOver) {
      this.handleInput();

      this.velocity.mult(this.friction);

      super.update();

      this.calculateInvincibleTime();
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
    } else {
      this.isMoving = false;
    }

    // HyperJump
    if (keyIsDown(DOWN_ARROW) && !this.downHeld) {
      this.position.x = random(width);
      this.position.y = random(height);
      this.velocity.set(0);
      this.downHeld = true;
    }
    if (!keyIsDown(DOWN_ARROW)) {
      this.downHeld = false;
    }
  }

  loseLife() {
    if (!this.isInvincible) {
      if (this.lives > 0) {
        --this.lives;
        this.isInvincible = true;
        console.log("Player is dead. lives: ", this.lives);
        this.position.x = width / 2;
        this.position.y = height / 2;
        this.velocity.set(0);
        this.angle = -PI / 2;
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

  gainExtraLife() {
    this.lives++;
  }

  death() {
    console.log("Game Over");
    this.isGameOver = true;
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle + HALF_PI);
    imageMode(CENTER);
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
