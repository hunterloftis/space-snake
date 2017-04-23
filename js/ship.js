function Ship(home, orbit, angle = 0, size=50) {
  const speed = Math.random() * 12 + 3
  let cooldown = 0
  let ship = {
    orbiting: true,
    x: undefined,
    y: undefined,
    angle,
    size,
    update
  }

  return ship

  function update(seconds, snake) {
    searchFor(snake)
    followOrbit(seconds)
    followTarget(seconds, snake)
    shootTarget(seconds, snake)
  }

  function searchFor(snake) {
    if (!ship.orbiting) return
    if (ship.x !== undefined && ship.y !== undefined) {
      if (snake.distanceFrom(ship.x, ship.y) < 40 * ship.size) {
        ship.orbiting = false
      }
    }
  }

  function followOrbit(seconds) {
    if (!ship.orbiting) return
    ship.angle += Math.PI * 2 * seconds / 15
    const orbitAngle = ship.angle - Math.PI * 0.5
    ship.x = home.x + Math.cos(orbitAngle) * orbit
    ship.y = home.y + Math.sin(orbitAngle) * orbit
  }

  function followTarget(seconds, snake) {
    if (ship.orbiting) return
    const dx = snake.x - ship.x
    const dy = snake.y - ship.y
    ship.angle = Math.atan2(dy, dx)
    ship.x += Math.cos(ship.angle) * ship.size * speed * seconds
    ship.y += Math.sin(ship.angle) * ship.size * speed * seconds
  }

  function shootTarget(seconds, snake) {
    if (ship.orbiting) return
    if (snake.distanceFrom(ship.x, ship.y) > 50 * ship.size) return

  }
}
