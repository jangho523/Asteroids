class Player extends BaseActor {
  constructor(position) {
    super(30, position, createVector(0, 0));
    this.rotateSpeed = 0.1;
    this.angle = -PI / 2;
    this.friction = 0.95;
    this.downHeld = false;
    this.lives = 5;
    this.isInvincible = false;
    this.invincibleTimer = 0;
  }

  update() {
    this.handleInput();

    this.velocity.mult(this.friction);

    super.update();

    this.calculateInvincibleTime();
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
      force.mult(0.2);
      this.velocity.add(force);
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
        this.angle = - PI / 2;
      }

      if (this.lives == 0) {
        this.death();
      }
    }
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

  death() {
    console.log("Game Over");
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);

    if (this.isInvincible) {
      fill("Green");
    } else {
      noFill();
    }

    stroke(255);

    triangle(18, 0, -12, -10, -12, 10);

    pop();
  }
}
