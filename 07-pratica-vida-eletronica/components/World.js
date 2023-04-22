import { Grid } from "./Grid.js";
import { Vector } from "./Vector.js";
import { View } from "./View.js";


var directions = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector(-1,  1),
  "w":  new Vector(-1,  0),
  "nw": new Vector(-1, -1)
};

function elementFromChar(legend, ch) {
  if (ch == " ")
    return null;
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

export function charFromElement(element) {
  if (element == null)
    return " ";
  else
    return element.originChar;
}

class World {
  constructor(map, legend) {
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;

    map.forEach(function (line, y) {
      for (var x = 0; x < line.length; x++)
        grid.set(new Vector(x, y),
          elementFromChar(legend, line[x]));
    });
  }

  checkDestination(action, vector) {
    if (directions.hasOwnProperty(action.direction)) {
      var dest = vector.plus(directions[action.direction]);
      if (this.grid.isInside(dest))
        return dest;
    }
  };

  // TODO: deixei comentado porque na herança não consegui sobreescrever este método.
  // letAct = function(critter, vector) {
  //   var action = critter.act(new View(this, vector));
  //   if (action && action.type == "move") {
  //     var dest = this.checkDestination(action, vector);
  //     if (dest && this.grid.get(dest) == null) {
  //       this.grid.set(vector, null);
  //       this.grid.set(dest, critter);
  //     }
  //   }
  // };

  toString = function() {
    var output = "";
    for (var y = 0; y < this.grid.height; y++) {
      for (var x = 0; x < this.grid.width; x++) {
        var element = this.grid.get(new Vector(x, y));
        output += charFromElement(element);
      }
      output += "\n";
    }
    return output;
  };

  turn = function() {
    var acted = [];
    this.grid.forEach(function(critter, vector) {
      if (critter.act && acted.indexOf(critter) == -1) {
        acted.push(critter);
        this.letAct(critter, vector);
      }
    }, this);
  };
}


class LifelikeWorld extends World {
  constructor(map, legend) {
    super(map, legend);
    this.actionTypes = Object.create(null);

    this.actionTypes.grow = function(critter) {
      critter.energy += 0.5;
      return true;
    };
  
    this.actionTypes.move = function(critter, vector, action) {
      var dest = this.checkDestination(action, vector);
      if (dest == null || critter.energy <= 1 || this.grid.get(dest) != null)
        return false;
      critter.energy -= 1;
      this.grid.set(vector, null);
      this.grid.set(dest, critter);
      return true;
    };
  
    this.actionTypes.eat = function(critter, vector, action) {
      var dest = this.checkDestination(action, vector);
      var atDest = dest != null && this.grid.get(dest);
      if (!atDest || atDest.energy == null)
        return false;
      critter.energy += atDest.energy;
      this.grid.set(dest, null);
      return true;
    };
  
    this.actionTypes.reproduce = function(critter, vector, action) {
      var baby = elementFromChar(this.legend, critter.originChar);
      var dest = this.checkDestination(action, vector);
      if (dest == null || critter.energy <= 2 * baby.energy || this.grid.get(dest) != null)
        return false;
      critter.energy -= 2 * baby.energy;
      this.grid.set(dest, baby);
      return true;
    };
  }

  letAct(critter, vector) {
    var action = critter.act(new View(this, vector));
    var handled = action && action.type in this.actionTypes && this.actionTypes[action.type].call(this, critter, vector, action);
    if (!handled) {
      critter.energy -= 0.2;
      if (critter.energy <= 0)
        this.grid.set(vector, null);
    }
  }
}

class Wall {}

function dirPlus(dir, n) {
  var directionNames = "n ne e se s sw w nw".split(" ");
  var index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}


class WallFollower {
  constructor() {
    this.dir = "s";
  }

  act(view) {
    var start = this.dir;
    if (view.look(dirPlus(this.dir, -3)) != " ")
      start = this.dir = dirPlus(this.dir, -2);
    while (view.look(this.dir) != " ") {
      this.dir = dirPlus(this.dir, 1);
      if (this.dir == start)
        break;
    }
    return { type: "move", direction: this.dir };
  }
}


export { LifelikeWorld, World, Wall, WallFollower }
