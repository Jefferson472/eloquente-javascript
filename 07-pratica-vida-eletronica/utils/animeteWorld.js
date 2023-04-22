export function animateWorld(world) {
  var running = null;
  function runAnimation() {
    running = setInterval(function() {
      world.turn();
      console.log(world.toString());
    }, 1000 / 3);
  }

  runAnimation();
}
