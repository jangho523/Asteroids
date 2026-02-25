class Player extends BaseActor {
  constructor(position) {
    super(30, position, createVector(0, 0));
    this.rotateSpeed = 0.1;
    this.angle = 0;
  }

  update() {
    this.handleInput();
    super.update();
  }

  handleInput() {
    if (keyIsDown(LEFT_ARROW)) {
      this.angle -= this.rotateSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.angle += this.rotateSpeed;
    }
    if (keyIsDown(UP_ARROW)) {
      let force = p5.Vector.fromAngle(this.angle);
      force.mult(0.2);
      this.velocity.add(force);
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
