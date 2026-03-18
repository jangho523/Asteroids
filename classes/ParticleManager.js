class ParticleManager {
  constructor(position, size) {
    this.position = position.copy();
    this.size = size;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameInterval = 0.08;
    this.isDead = false;
    this.isFading = false;
    this.alpha = 255;
  }

  update() {
    this.frameTimer += deltaTime / 1000;

    if (this.frameTimer >= this.frameInterval) {
      this.frameTimer = 0;
      this.frameIndex++;

      if (this.frameIndex >= 4) {
        this.isFading = true;
      }
      if (this.frameIndex >= explosionImages.length) {
        this.frameIndex = explosionImages.length - 1;
      }
    }

    if (this.isFading) {
      this.alpha -= (255/0.2) * (deltaTime / 1000);
      if (this.alpha <= 0) {
        this.isDead = true;
      }
    }
  }

  draw() {
    push();
    if (!this.isDead) {
      translate(this.position.x, this.position.y);
      imageMode(CENTER);
      tint(255, this.alpha);
      image(explosionImages[this.frameIndex], 0, 0, this.size, this.size);
      noTint();
    }
    pop();
  }
}
