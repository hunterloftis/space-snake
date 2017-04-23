function Snake(x, y, size) {
  const turnSpeed = Math.PI
  const speed = 10
  const snake = {
    position: [{ x, y, size }],
    get x() { return this.position[0].x },
    get y() { return this.position[0].y },
    get size() { return this.position[0].size },
    set size(n) { this.position[0].size = n },
    get moveSpeed() { return speed * this.size },
    direction: 0,
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
    if (snake.damage >= 1) return
    move(seconds, input)
    hitBodies(seconds, bodies)
  }

  function hitBodies(seconds, bodies) {
    const collisions = bodies.filter(isColliding)
    const obstacles = collisions.filter(eat)
    takeDamage(seconds * obstacles.length * DAMAGE)
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
      size: snake.size
    })
    snake.position.splice(100)
  }

  function isColliding(body) {
    if (body.isConsumed) return false
    const range = body.size + snake.size
    const dx = body.x - snake.position[0].x
    const dy = body.y - snake.position[0].y
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