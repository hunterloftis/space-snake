function Ship(home, orbit, angle = 0, size=50) {
  const speed = Math.random() * 0.5 + 0.3
  let cooldown = 0
  let ship = {
    orbiting: true,
    x: undefined,
    y: undefined,
    bullets: [],
    angle,
    size,
    update,
    life: 1
  }

  return ship

  function update(seconds, snake) {
    searchFor(snake)
    followOrbit(seconds)
    followTarget(seconds, snake)
    updateBullets(seconds, snake)
    checkCollisions(snake)
    shootTarget(seconds, snake)
  }

  function checkCollisions(snake) {
    if (snake.distanceFrom(ship.x, ship.y) < snake.size) {
      snake.grow(ship.size * 1.5)
      ship.life = 0
    }
  }

  function searchFor(snake) {
    if (!ship.orbiting) return
    if (ship.x !== undefined && ship.y !== undefined) {
      if (snake.distanceFrom(ship.x, ship.y) < 30 * ship.size) {
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
    const followSpeed = speed * snake.moveSpeed
    ship.angle = Math.atan2(dy, dx)
    if (snake.distanceFrom(ship.x, ship.y) > 18 * ship.size) {
      ship.x += Math.cos(ship.angle) * followSpeed * seconds
      ship.y += Math.sin(ship.angle) * followSpeed * seconds
    }
  }

  function updateBullets(seconds, snake) {
    ship.bullets.forEach(bullet => bullet.update(seconds, snake))
    ship.bullets = ship.bullets.filter(bullet => bullet.life > 0)
  }

  function shootTarget(seconds, snake) {
    if (ship.orbiting) return
    if (snake.distanceFrom(ship.x, ship.y) > 20 * ship.size) return
    cooldown -= seconds
    if (cooldown > 0) return
    ship.bullets.push(Bullet(ship.x, ship.y, ship.angle))
    cooldown = 0.2
  }
}
