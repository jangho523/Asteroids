class ParticleManager {
  constructor(position,size) {
    this.position = position.copy();
    this.size = size;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameInterval = 0.08;
    this.isDead = false;
  }

  update() {
    this.frameTimer += deltaTime / 1000;

    if (this.frameTimer >= this.frameInterval) {
      this.frameTimer = 0;
      this.frameIndex++;

      if (this.frameIndex >= explosionImages.length) {
        this.isDead = true;
      }
    }
  }

  draw() {
    push();
    if (!this.isDead) {
      translate(this.position.x, this.position.y);
      imageMode(CENTER);
      image(explosionImages[this.frameIndex], 0, 0, this.size, this.size);
    }
    pop();
  }
}
