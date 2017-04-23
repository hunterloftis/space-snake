const SUN_COLOR = '#ECFEAA'
const BODY_COLOR = '#23B5D3'
const EATING_EFFICIENCY = 0.25
const DAMAGE = 0.25

function Game(input) {
  let snake = Snake(400, 600, 5)
  // let snake = Snake(400, 600, 100)
  let [ bodies, ships ] = Bodies(123, 3)
  // const particles = []  // expel particles on collisions that you can reclaim
  const game = {
    snake,
    bodies,
    ships,
    update
  }
  bodies = ships = snake = undefined // hack

  return game

  function update(seconds) {
    game.bodies.forEach(body => body.update(seconds))
    game.snake.update(seconds, input, game.bodies, game.ships)
    game.ships.forEach(ship => ship.update(seconds, game.snake))
    game.ships = game.ships.filter(ship => ship.life > 0)
  }
}
