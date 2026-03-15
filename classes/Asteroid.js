class Asteroid extends BaseActor {
  constructor(size, position, velocity) {
    super(size, position, velocity);
    this.acceleration = createVector(0, 0);
    this.angle = 0;
    this.rotateSpeed = random(-0.03, 0.03);
    if (this.size == 50) {
      this.type = "large";
      this.imageType = floor(random(3));
    } else if (this.size == 35) {
      this.type = "medium";
      this.imageType = floor(random(3));
    } else if (this.size == 25) {
      this.type = "small";
      this.imageType = floor(random(3));
    }
  }

  update() {
    // Acceleration changes velocity.
    this.velocity.add(this.acceleration);
    // Reset acceleration each update.
    this.acceleration.set(0, 0);
    this.angle += this.rotateSpeed;
    super.update();
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(asteroidImages[this.imageType], 0, 0, this.size, this.size);
    pop();
  }
}
