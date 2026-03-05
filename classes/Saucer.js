class Saucer extends BaseActor {
  constructor(size, position, velocity) {
    super(size, position, velocity);
    this.acceleration = createVector(0, 0);

    if (this.size == 50) {
      this.type = "large";
    } else if (this.size == 30) {
      this.type = "small";
    }

    if (this.type === "large") {
      this.velocity.mult(1);
    } else if (this.type === "small") {
      this.velocity.mult(2);
    }

    this.yMoveTimer = 0;
    this.yMoveDuration = random(0.8, 1.5);
    this.yPauseDuration = random(2, 3);
    this.yMoving = false;
  }

  update() {
    this.yMoveTimer += deltaTime / 1000;

    // y movement
    if (!this.yMoving) {
      // they move up or down
      if (this.yMoveTimer >= this.yPauseDuration) {
        this.yMoving = true;
        this.yMoveTimer = 0;
        this.yMoveDuration = random(0.8, 1.5);
        this.velocity.y = random(-3, 3);
      }
    } else {
      // they move straight
      if (this.yMoveTimer >= this.yMoveDuration) {
        this.yMoving = false;
        this.yMoveTimer = 0;
        this.yPauseDuration = random(2, 3);
        this.velocity.y = 0;
      }
    }

    // Acceleration changes velocity.
    this.velocity.add(this.acceleration);
    // Reset acceleration each update.
    this.acceleration.set(0, 0);

    super.update();
  }

  draw() {
    push();
    fill("Orange");
    circle(this.position.x, this.position.y, this.size);
    pop();
  }
}
