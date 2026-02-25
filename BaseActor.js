class BaseActor {
  constructor(size, position, velocity = createVector(0, 0)) {
    this.size = size;
    this.position = position;
    this.velocity = velocity;
  }

  update() {
    // Velocity changes position.
    this.position.add(this.velocity);

    this.wrap(); // Screen wrap.
  }

  draw() {}

  wrap() {
    // Wrap right and left edges.
    if (this.position.x > width) {
      this.position.x = -this.size;
    } else if (this.position.x < -this.size) {
      this.position.x = width;
    }

    // Wrap bottom and top edges.
    if (this.position.y > height) {
      this.position.y = -this.size;
    } else if (this.position.y < -this.size) {
      this.position.y = height;
    }
  }
}
