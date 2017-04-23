const SUN_COLOR = '#ECFEAA'
const BODY_COLOR = '#23B5D3'
const EATING_EFFICIENCY = 0.25
const DAMAGE = 0.25

function Game(input) {
  const snake = Snake(400, 600, 5)
  // const snake = Snake(400, 600, 100)
  const [ bodies, ships ] = Bodies(123, 3)
  // const particles = []  // expel particles on collisions that you can reclaim
  const game = {
    snake,
    bodies,
    ships,
    update
  }

  return game

  function update(seconds) {
    bodies.forEach(body => body.update(seconds))
    snake.update(seconds, input, bodies)
    ships.forEach(ship => ship.update(seconds, snake))
  }
}
