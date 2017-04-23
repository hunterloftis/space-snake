function Snake(x, y, size) {
  const turnSpeed = Math.PI
  const speed = 10
  const state = {
    position: [{ x, y }],
    direction: 0,
    clockwise: true,
    damage: 0,
    size
  }

  return {
    update,
    getState,
    distance
  }

  function distance(x, y) {
    const dx = x - state.position[0].x
    const dy = y - state.position[0].y
    return Math.sqrt(dx * dx + dy * dy)
  }

  function update(seconds, input, bodies) {
    if (state.damage >= 1) return
    move(seconds, input)
    const collisions = bodies.filter(isColliding)
    const obstacles = collisions.filter(eat)
    state.damage += seconds * obstacles.length * DAMAGE
  }

  function move(seconds, input) {
    if (input.left) state.clockwise = false
    else if (input.right) state.clockwise = true
    const sign = state.clockwise ? 1 : -1
    state.direction += turnSpeed * seconds * sign
    const dist = speed * seconds * state.size
    const dx = Math.cos(state.direction) * dist
    const dy = Math.sin(state.direction) * dist
    state.position.unshift({
      x: state.position[0].x + dx,
      y: state.position[0].y + dy
    })
    state.position.splice(100)
  }

  function isColliding(body) {
    if (body.isConsumed) return false
    const bodyState = body.getState()
    const range = bodyState.size + state.size
    const dx = bodyState.x - state.position[0].x
    const dy = bodyState.y - state.position[0].y
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist < range
  }

  function eat(body) {
    if (body.isLargerThan(state.size)) return true
    state.size += body.consume()
    return false
  }

  function getState() {
    return Object.assign({
      x: state.position[0].x,
      y: state.position[0].y
    }, state)
  }
}
