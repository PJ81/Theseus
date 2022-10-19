import Point from "./point.js";

export default class Entity {
  pos: Point;
  target: Point;
  moving: boolean;
  dir: Point;

  constructor() {
    this.pos = new Point();
    this.target = new Point();
    this.moving = false;
  }

  setPosition(x: number, y: number): void {
    this.pos.set(x, y);
  }

  setTarget(x: number, y: number): void {
    this.target.set(x, y);
    this.dir = this.pos.heading(this.target);
    this.moving = true;
  }

  update(dt: number): boolean {
    if (!this.moving) return;
    const dist = this.pos.dist(this.target);
    if (dist < 0.005) {
      this.pos.set(Math.ceil(this.target.x), Math.ceil(this.target.y));
      return false;
    } else {
      this.pos.x += this.dir.x * dt * dist * 30;
      this.pos.y += this.dir.y * dt * dist * 30;
    }
    return true;
  }
}