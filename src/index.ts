import Board from "./board.js";
import Game from "./game.js";
import Keyboard from "./keyboard.js";

class Theseus extends Game {
  board: Board;
  keys: Keyboard;


  constructor() {
    super();
    this.board = new Board();
    this.keys = new Keyboard((dir: number, e: number) => { if (e) this.board.move(dir); });
    this.loop();
  }

  update(dt: number): void {
    this.board.update(dt);
  }

  draw(): void {
    this.board.draw(this.ctx);
  }
}

new Theseus();