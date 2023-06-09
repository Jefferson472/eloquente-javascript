import {Vector} from "./Vector.js"


class Coin {
  constructor(pos) {
    this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
    this.size = new Vector(0.6, 0.6);
    this.wobble = Math.random() * Math.PI * 2;
    this.type = "coin";
  }
  
  act = function(step) {
    var wobbleSpeed = 8, wobbleDist = 0.07;
    this.wobble += step * wobbleSpeed;
    var wobblePos = Math.sin(this.wobble) * wobbleDist;
    this.pos = this.basePos.plus(new Vector(0, wobblePos));
  };
}

export {Coin}
