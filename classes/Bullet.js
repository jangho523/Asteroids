class Bullet extends BaseActor {
  constructor(position, angle, isSaucerBullet) {
    super(
      20,
      createVector(position.x, position.y),
      p5.Vector.fromAngle(angle).mult(10),
    );
    this.angle = angle;
    this.lifeSpan = 1.5;
    this.isDead = false;
    this.isSaucerBullet = isSaucerBullet;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameInterval = 0.1;

    this.isFading = false;
    this.alpha = 255;
  }

  update() {
    super.update();

    this.lifeSpan -= deltaTime / 1000;
    if (this.lifeSpan <= 0) {
      this.isFading = true;
    }

    this.frameTimer += deltaTime / 1000;

    if (this.frameTimer >= this.frameInterval) {
      this.frameTimer = 0;
      this.frameIndex++;

      if (this.isSaucerBullet) {
        if (this.frameIndex >= 3) {
          this.frameIndex = 3;
        }
      } else {
        if (this.frameIndex >= 1) {
          this.frameIndex = 1;
        }
      }
    }

    if (this.isFading) {
      this.alpha -= (255 / 0.1) * (deltaTime / 1000);
      if (this.alpha <= 0) {
        this.isDead = true;
      }
    }
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    imageMode(CENTER);
    tint(255, this.alpha);
    if (this.isSaucerBullet) {
      image(saucerBulletImages[this.frameIndex], 0, 0, this.size, this.size);
    } else {
      image(playerBulletImages[this.frameIndex], 0, 0, this.size, this.size);
    }
    noTint();
    pop();
  }
}
