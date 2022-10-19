import * as Const from "./const.js";
import Entity from "./entity.js";
import Levels from "./Levels.js";
import Point from "./point.js";

export default class Board {
  solution: Array<string>;
  level: number[][];
  size: Point;
  player: Entity;
  mino: Entity;
  exit: Point;
  scale: Point;
  moves: number;
  mvCount: HTMLParagraphElement;
  solCount: HTMLParagraphElement;
  gameState: number;
  minoStepCounter: number;
  endEffectPos: Point;
  endEffectSize: number;
  endEffectClr: string;
  levelsList: Levels;
  solIndex: number;
  showingSolution: boolean;

  constructor() {
    this.moves = 0;
    this.mvCount = document.querySelector("#movesCount");
    this.solCount = document.querySelector("#solCount");
    this.solCount.addEventListener("click", () => { this.solClick(); });
    this.size = new Point(); this.player = new Entity();
    this.mino = new Entity(); this.exit = new Point();
    this.scale = new Point();
    this.gameState = Const.PLAYER_MOVE;
    this.levelsList = new Levels();
    this.loadLevel(this.levelsList.getLevel());
  }

  solClick(): void {
    this.gameState = Const.SHOW_SOLUTION;
    this.solIndex = 0;
    this.showingSolution = true;
  }

  getLevelAt(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= this.size.x || y >= this.size.y) return 7;
    return this.level[y][x];
  }

  move(dir: number) {
    if (this.gameState !== Const.PLAYER_MOVE) return;
    this.moveEntity(dir, this.player, Const.PLAYER_MOVING);
  }

  private moveEntity(dir: number, entity: Entity, state: number): boolean {
    switch (dir) {
      case Const.LEFT:
        if ((this.getLevelAt(entity.pos.x - 1, entity.pos.y) & 2) === 0) {
          entity.setTarget(entity.pos.x - 1, entity.pos.y);
          this.gameState = state;
          return true;
        }
        break;
      case Const.RIGHT:
        if ((this.getLevelAt(entity.pos.x, entity.pos.y) & 2) === 0) {
          entity.setTarget(entity.pos.x + 1, entity.pos.y);
          this.gameState = state;
          return true;
        }
        break;
      case Const.UP:
        if ((this.getLevelAt(entity.pos.x, entity.pos.y - 1) & 1) === 0) {
          entity.setTarget(entity.pos.x, entity.pos.y - 1);
          this.gameState = state;
          return true;
        }
        break;
      case Const.DOWN:
        if ((this.getLevelAt(entity.pos.x, entity.pos.y) & 1) === 0) {
          entity.setTarget(entity.pos.x, entity.pos.y + 1);
          this.gameState = state;
          return true;
        }
        break;
      case Const.SKIP:
        this.minoStepCounter = 0;
        this.moves++;
        this.gameState = Const.MINO_MAKE_STEP;
        return true;
    }
    return false;
  }

  loadLevel(lvl: string): void {
    let l = lvl.split(" ");
    this.moves = 0;
    this.size.set(parseInt(l[0]), parseInt(l[1]));
    this.player.setPosition(parseInt(l[2]), parseInt(l[3]));
    this.mino.setPosition(parseInt(l[4]), parseInt(l[5]));
    this.exit.set(parseInt(l[6]), parseInt(l[7]));
    this.scale.set(Const.WIDTH / this.size.x, Const.HEIGHT / this.size.y);
    this.level = [];

    for (let y = 0; y < this.size.y; y++) {
      this.level[y] = [];
      for (let x = 0; x < this.size.x; x++) {
        this.level[y][x] = parseInt(l[8 + x + y * this.size.x]);
      }
    }

    for (let x = 0; x < this.size.x; x++) {
      this.level[this.size.y - 1][x] += 1;
    }

    for (let y = 0; y < this.size.y; y++) {
      this.level[y][this.size.x - 1] += 2;
    }

    let s = this.size.x * this.size.y + 8;
    this.solution = [];
    for (; s < l.length; s++) {
      if (l[s].length === 1) this.solution.push(l[s]);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    let even = this.size.x % 2 === 0;
    let c1 = "#ccd", c2 = "#eef", clr = c1;
    let sx = this.scale.x * 0.5, sy = this.scale.y * 0.5, rad = Math.min(sx, sy) * 0.65;

    ctx.strokeStyle = "black";
    ctx.lineWidth = rad * .25;
    ctx.beginPath();

    for (let y = 0; y < this.size.y; y++) {
      for (let x = 0; x < this.size.x; x++) {
        ctx.fillStyle = clr;
        ctx.fillRect(x * this.scale.x, y * this.scale.y, this.scale.x, this.scale.y);
        clr = clr === c1 ? c2 : c1;

        switch (this.level[y][x]) {
          case 1:
            ctx.moveTo(x * this.scale.x, (1 + y) * this.scale.y);
            ctx.lineTo(x * this.scale.x + this.scale.x, (1 + y) * this.scale.y);
            break;
          case 2:
            ctx.moveTo((1 + x) * this.scale.x, y * this.scale.y);
            ctx.lineTo((1 + x) * this.scale.x, y * this.scale.y + this.scale.y);
            break;
          case 3:
            ctx.moveTo(x * this.scale.x, (1 + y) * this.scale.y);
            ctx.lineTo(x * this.scale.x + this.scale.x, (1 + y) * this.scale.y);
            ctx.moveTo((1 + x) * this.scale.x, y * this.scale.y);
            ctx.lineTo((1 + x) * this.scale.x, y * this.scale.y + this.scale.y);
            break;
        }
      }
      if (even) clr = clr === c1 ? c2 : c1;
    }

    ctx.moveTo(0, Const.HEIGHT);
    ctx.lineTo(0, 0);
    ctx.lineTo(Const.WIDTH, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.lineCap = "round";
    ctx.lineWidth = rad * .36;
    ctx.moveTo(this.exit.x * this.scale.x + sx * .7, this.exit.y * this.scale.y + sy * .7);
    ctx.lineTo(this.exit.x * this.scale.x + sx + sx * .3, this.exit.y * this.scale.y + sy + sy * .3);
    ctx.moveTo(this.exit.x * this.scale.x + sx + sx * .3, this.exit.y * this.scale.y + sy * .7);
    ctx.lineTo(this.exit.x * this.scale.x + sx * .7, this.exit.y * this.scale.y + sy + sy * .3);
    ctx.stroke();

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.player.pos.x * this.scale.x + sx, this.player.pos.y * this.scale.y + sy, rad, 0, Const.TWO_PI);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(this.mino.pos.x * this.scale.x + sx, this.mino.pos.y * this.scale.y + sy, rad, 0, Const.TWO_PI);
    ctx.fill();

    this.mvCount.innerText = `Moves: ${this.moves}`;
    this.solCount.innerText = `Solution: ${this.solution.length}`;

    if (this.gameState === Const.END_EFFECT || this.gameState === Const.BEGIN_EFFECT) {
      ctx.beginPath();
      ctx.fillStyle = this.endEffectClr;
      ctx.arc(this.endEffectPos.x * this.scale.x + sx, this.endEffectPos.y * this.scale.y + sy, this.endEffectSize, 0, Const.TWO_PI);
      ctx.fill();
    }
  }

  levelFinished(state: number): number {
    if (this.player.pos.equals(this.mino.pos)) {
      this.endEffectPos = this.mino.pos.copy();
      this.endEffectClr = "red";
      this.endEffectSize = Math.min(this.scale.x * 0.5, this.scale.y * 0.5) * 0.65;
      return Const.END_EFFECT;
    }
    if (this.player.pos.equals(this.exit)) {
      this.endEffectPos = this.player.pos.copy();
      this.endEffectClr = "blue";
      this.endEffectSize = Math.min(this.scale.x * 0.5, this.scale.y * 0.5) * 0.65;
      return Const.END_EFFECT;
    }
    return state;
  }

  createMinoStep() {
    let dirH = Math.sign(this.player.pos.x - this.mino.pos.x),
      dirV = Math.sign(this.player.pos.y - this.mino.pos.y),
      r = false;
    if (dirH != 0) {
      if (dirH < 0) r = this.moveEntity(Const.LEFT, this.mino, Const.MINO_WALKING);
      else r = this.moveEntity(Const.RIGHT, this.mino, Const.MINO_WALKING);
    }

    if (r) return;

    if (dirV != 0) {
      if (dirV < 0) r = this.moveEntity(Const.UP, this.mino, Const.MINO_WALKING);
      else r = this.moveEntity(Const.DOWN, this.mino, Const.MINO_WALKING);
    }
  }

  update(dt: number) {
    let r: boolean;
    switch (this.gameState) {
      case Const.PLAYER_MOVE: break;
      case Const.PLAYER_MOVING:
        if (!this.player.update(dt)) {
          this.minoStepCounter = 0;
          this.moves++;
          this.gameState = this.levelFinished(Const.MINO_MAKE_STEP);
        }
        break;
      case Const.MINO_WALKING:
        if (!this.mino.update(dt)) {
          this.gameState = this.levelFinished(Const.MINO_MAKE_STEP);
        }
        break;
      case Const.MINO_MAKE_STEP:
        if (++this.minoStepCounter > 2) {
          this.gameState = this.showingSolution ? Const.SHOW_SOLUTION : Const.PLAYER_MOVE;
          return;
        }
        this.createMinoStep();
        break;
      case Const.END_EFFECT:
        if ((this.endEffectSize += dt * Const.EFFECT_SPEED) > 950) {
          if (this.endEffectClr === "red") {
            this.loadLevel(this.levelsList.getLevel());
            this.endEffectPos = this.mino.pos.copy();
          } else {
            this.loadLevel(this.levelsList.nextLevel());
            this.endEffectPos = this.player.pos.copy();
          }
          this.gameState = Const.BEGIN_EFFECT;
        }
        break;
      case Const.BEGIN_EFFECT:
        if ((this.endEffectSize -= dt * Const.EFFECT_SPEED) < 30) {
          this.gameState = Const.PLAYER_MOVE;
        }
        break;
      case Const.SHOW_SOLUTION:
        let d = this.solution[this.solIndex];
        this.moveEntity(d === "L" ? Const.LEFT : d === "R" ? Const.RIGHT : d === "U" ? Const.UP : d === "D" ? Const.DOWN : Const.SKIP, this.player, Const.PLAYER_MOVING);
        if (++this.solIndex >= this.solution.length) {
          this.gameState = Const.PLAYER_MOVE;
          this.showingSolution = false;
        }
        break;
    }
  }
}