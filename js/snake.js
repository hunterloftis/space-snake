function Snake(x, y, size) {
  const turnSpeed = Math.PI
  const speed = 10
  const snake = {
    position: [{ x, y }],
    get x() { return this.position[0].x },
    get y() { return this.position[0].y },
    direction: 0,
    clockwise: true,
    damage: 0,
    size,
    update,
    distanceFrom
  }

  return snake

  function distanceFrom(x, y) {
    const dx = x - snake.position[0].x
    const dy = y - snake.position[0].y
    return Math.sqrt(dx * dx + dy * dy)
  }

  function update(seconds, input, bodies) {
    if (snake.damage >= 1) return
    move(seconds, input)
    const collisions = bodies.filter(isColliding)
    const obstacles = collisions.filter(eat)
    snake.damage += seconds * obstacles.length * DAMAGE
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
      x: snake.position[0].x + dx,
      y: snake.position[0].y + dy
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
}
