function Snake(x, y, size) {
  const turnSpeed = Math.PI
  const speed = 10
  let nextParticle = 0
  const snake = {
    position: [{ x, y, size, direction: 0 }],
    get x() { return this.position[0].x },
    get y() { return this.position[0].y },
    get size() { return this.position[0].size },
    set size(n) { this.position[0].size = n },
    get moveSpeed() { return speed * this.size },
    get direction() { return this.position[0].direction },
    set direction(n) { this.position[0].direction = n },
    particles: [],
    clockwise: true,
    damage: 0,
    update,
    distanceFrom,
    takeDamage,
    grow
  }

  return snake

  function grow(mass) {
    snake.size += mass * 0.25
  }

  function distanceFrom(x, y) {
    const dx = x - snake.position[0].x
    const dy = y - snake.position[0].y
    return Math.sqrt(dx * dx + dy * dy)
  }

  function update(seconds, input, bodies, ships) {
    updateParticles(seconds)
    if (snake.damage >= 1) return
    move(seconds, input)
    hitBodies(seconds, bodies)
  }

  function updateParticles(seconds) {
    snake.particles = snake.particles.filter(particle => particle.life > 0)
    snake.particles.forEach(particle => particle.update(seconds))
  }

  function hitBodies(seconds, bodies) {
    const collisions = bodies.filter(isColliding)
    const obstacles = collisions.filter(eat)
    takeDamage(seconds * obstacles.length * DAMAGE)
    if (performance.now() > nextParticle) {
      const particles = obstacles.reduce((particles, body) => {
        const direction = Math.atan2(body.y - snake.y, body.x - snake.x)
        const x = snake.x + Math.cos(direction) * snake.size
        const y = snake.y + Math.sin(direction) * snake.size
        const speedX = Math.cos(snake.direction) * snake.size * -speed * Math.random()
        const speedY = Math.sin(snake.direction) * snake.size * -speed * Math.random()
        particles.push(Particle(x, y, snake.size * 0.3, speedX, speedY))
        return particles
      }, [])
      snake.particles.push(...particles)
      nextParticle = performance.now() + 25
    }
  }

  function move(seconds, input) {
    if (input.left) snake.clockwise = false
    else if (input.right) snake.clockwise = true
    const sign = snake.clockwise ? 1 : -1
    snake.direction += turnSpeed * seconds * sign
    const dist = speed * seconds * snake.size
    const dx = Math.cos(snake.direction) * dist
    const dy = Math.sin(snake.direction) * dist
    snake.position.unshift({
      x: snake.x + dx,
      y: snake.y + dy,
      size: snake.size,
      direction: snake.direction
    })
    snake.position.splice(100)
  }

  function isColliding(body) {
    if (body.isConsumed) return false
    const range = body.size + snake.size
    const dx = body.x - snake.x
    const dy = body.y - snake.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist < range
  }

  function eat(body) {
    if (body.isLargerThan(snake.size)) return true
    snake.size += body.consume()
    return false
  }

  function takeDamage(amount) {
    if (snake.damage >= 1) return
    snake.damage = Math.min(snake.damage + amount, 1)
  }
}

function Particle(x, y, size, speedX, speedY) {
  const particle = {
    x, y, size,
    life: 1,
    update
  }

  return particle

  function update(seconds) {
    particle.x += speedX * seconds
    particle.y += speedY * seconds
    particle.life -= seconds
  }
}
