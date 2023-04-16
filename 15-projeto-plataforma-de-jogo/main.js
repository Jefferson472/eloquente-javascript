import {DOMDisplay} from "./components/DOMDisplay.js"
import {runGame} from "./utils/runGame.js"


var plan = [
  "                      ",
  "                      ",
  "  x              = x  ",
  "  x         o o    x  ",
  "  x @      xxxxx   x  ",
  "  xxxxx            x  ",
  "      x!!!!!!!!!!!!x  ",
  "      xxxxxxxxxxxxxx  ",
  "                      "
];

var GAME_LEVELS = [plan]

runGame(GAME_LEVELS, DOMDisplay);
