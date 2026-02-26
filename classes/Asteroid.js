class Asteroid extends BaseActor {
  constructor(size, position, velocity) {
    super(size, position, velocity);
    this.acceleration = createVector(0, 0);

    if (this.size == 50) {
      this.type = "large";
    } else if (this.size == 35) {
      this.type = "medium";
    } else if (this.size == 25) {
      this.type = "small";
    }
  }

  update() {
    // Acceleration changes velocity.
    this.velocity.add(this.acceleration);
    // Reset acceleration each update.
    this.acceleration.set(0, 0);

    super.update();
  }

  draw() {
    circle(this.position.x, this.position.y, this.size);
  }
}
