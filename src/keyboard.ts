import * as Const from "./const.js";

class Keyboard {
  keyState: Map<number, number>;
  keyAction: Map<number, Function>;
  addKey: (k: number, a: Function) => void;

  constructor() {
    this.keyState = new Map();
    this.keyAction = new Map();

    window.addEventListener("keydown", (e) => this.action(e));
    window.addEventListener("keyup", (e) => this.action(e));

    this.addKey = (k: number, a: Function) => {
      this.keyAction.set(k, a);
      this.keyState.set(k, Const.RELEASED);
    };
  }

  action(e: KeyboardEvent) {
    if (!this.keyState.has(e.keyCode)) return;

    e.preventDefault();

    const keyS = e.type === "keydown" ? Const.PRESSED : Const.RELEASED;

    if (this.keyState.get(e.keyCode) !== keyS) {
      this.keyState.set(e.keyCode, keyS);
      this.keyAction.get(e.keyCode)(keyS);
    }
  }

  clear() {
    this.keyState.clear();
    this.keyAction.clear();
  }
}

export default class Input {
  keyboard: Keyboard;
  constructor(fn: Function) {
    this.keyboard = new Keyboard();

    this.keyboard.addKey(Const.LEFT, (e: KeyboardEvent) => {
      fn(Const.LEFT, e);
    });
    this.keyboard.addKey(37, (e: KeyboardEvent) => {
      fn(Const.LEFT, e);
    });

    this.keyboard.addKey(Const.RIGHT, (e: KeyboardEvent) => {
      fn(Const.RIGHT, e);
    });
    this.keyboard.addKey(39, (e: KeyboardEvent) => {
      fn(Const.RIGHT, e);
    });

    this.keyboard.addKey(Const.UP, (e: KeyboardEvent) => {
      fn(Const.UP, e);
    });
    this.keyboard.addKey(38, (e: KeyboardEvent) => {
      fn(Const.UP, e);
    });

    this.keyboard.addKey(Const.DOWN, (e: KeyboardEvent) => {
      fn(Const.DOWN, e);
    });
    this.keyboard.addKey(40, (e: KeyboardEvent) => {
      fn(Const.DOWN, e);
    });
    this.keyboard.addKey(Const.SKIP, (e: KeyboardEvent) => {
      fn(Const.SKIP, e);
    });
  }
}