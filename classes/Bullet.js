class Bullet extends BaseActor {
  constructor(position, angle) {
    super(
      5,
      createVector(position.x, position.y),
      p5.Vector.fromAngle(angle).mult(8),
    );
    this.lifeSpan = 1.5;
    this.isDead = false;
  }

  update() {
    super.update();

    this.lifeSpan -= deltaTime / 1000;
    if (this.lifeSpan <= 0) {
      this.isDead = true;
    }
  }

  draw(isSaucerBullet) {
    push();
    if (isSaucerBullet) {
      fill("orange");
    }
    circle(this.position.x, this.position.y, this.size);
    pop();
  }
}
