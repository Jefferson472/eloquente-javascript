import {Vector} from "./Vector.js"


class Lava {
  constructor(pos, ch) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.type = "lava";

    if (ch == "=")
      this.speed = new Vector(2, 0);
    else if (ch == "|")
      this.speed = new Vector(0, 2);
    else if (ch == "v") {
      this.speed = new Vector(0, 3);
      this.repeatPos = pos;
    }
  }

  act(step, level) {
    var newPos = this.pos.plus(this.speed.times(step));
    if (!level.obstacleAt(newPos, this.size))
      this.pos = newPos;
    else if (this.repeatPos)
      this.pos = this.repeatPos;
    else
      this.speed = this.speed.times(-1);
  }
}

export {Lava}
