class Player extends BaseActor {
  constructor(position) {
    super(30, position, createVector(0, 0));
    this.rotateSpeed = 0.1;
    this.angle = 0;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.angle -= this.rotateSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.angle += this.rotateSpeed;
    }
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    noFill();
    stroke(255);

    triangle(18, 0, -12, -10, -12, 10);

    pop();
  }
}
