class Saucer extends BaseActor {
  constructor(size, position, velocity) {
    super(size, position, velocity);
    this.acceleration = createVector(0, 0);
    this.angle = 0;
    
    if (this.size == 70) {
      this.type = "large";
      this.rotateSpeed = 0.05;
    } else if (this.size == 50) {
      this.type = "small";
      this.rotateSpeed = 0.10;
    }

    if (this.type === "large") {
      this.velocity.mult(1);
    } else if (this.type === "small") {
      this.velocity.mult(2);
    }

    if(velocity.x < 0)
    {
      this.rotateSpeed = -this.rotateSpeed;
    }

    this.yMoveTimer = 0;
    this.yMoveDuration = random(0.8, 1.5);
    this.yPauseDuration = random(2, 3);
    this.yMoving = false;
  }

  update() {
    this.yMoveTimer += deltaTime / 1000;
    this.angle += this.rotateSpeed;
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
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(saucerImage, 0, 0, this.size, this.size);
    pop();
  }
}
