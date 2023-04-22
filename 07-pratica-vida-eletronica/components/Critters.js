export function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

class BouncingCritter {
  constructor() {
    var directionNames = "n ne e se s sw w nw".split(" ");
    this.direction = randomElement(directionNames);
  }

  act(view) {
    if (view.look(this.direction) != " ")
      this.direction = view.find(" ") || "s";
    return { type: "move", direction: this.direction };
  }
};


class Plant {
  constructor() {
    this.energy = 3 + Math.random() * 4;
  }

  act(context) {
    if (this.energy > 15) {
      var space = context.find(" ");
      if (space)
        return { type: "reproduce", direction: space };
    }
    if (this.energy < 20)
      return { type: "grow" };
  }
}


class PlantEater {
  constructor() {
    this.energy = 20;
  }

  act(context) {
    var space = context.find(" ");
    if (this.energy > 60 && space)
      return { type: "reproduce", direction: space };
    var plant = context.find("*");
    if (plant)
      return { type: "eat", direction: plant };
    if (space)
      return { type: "move", direction: space };
  }
}

export { BouncingCritter, Plant, PlantEater }
