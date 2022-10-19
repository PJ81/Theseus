import { L } from "./levelsJS.js";

export default class Levels {

  lvlIdx: Array<number>;
  index: number;

  constructor() {
    this.lvlIdx = new Array<number>();
    for (let z = 0; z < L.length; z++) {
      this.lvlIdx.push(z);
    }
    for (let z = 0; z < 10; z++) {
      this.lvlIdx.sort((a, b) => Math.random() < .5 ? 1 : -1);
    }
    this.index = 0;
  }

  getLevel(): string {
    console.log(this.index);
    return L[this.lvlIdx[this.index]];
  }

  nextLevel(): string {
    if ((++this.index >= L.length)) this.index = 0;
    return this.getLevel();
  }
}