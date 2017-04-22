function Game(input) {
  const snake = Snake(400, 600, 5)
  const planet = Body(650)
  const moon = Body(12, 720, 80, planet)
  const moon2 = Body(18, 900, 160, planet)
  const asteroid = Body(5, 50, 5, moon2)
  const asteroid2 = Body(3, 100, 6, moon2)
  const bodies = [ planet, moon, moon2, asteroid, asteroid2 ]
  const particles = []  // expel particles on collisions that you can reclaim

  return {
    update,
    getState
  }

  function update(seconds) {
    bodies.forEach(body => body.update(seconds))
    snake.update(seconds, input, bodies)
  }

  function getState() {
    return {
      snake: snake.getState(),
      bodies: bodies.map(body => body.getState())
    }
  }
}

function Snake(x, y, size) {
  const turnSpeed = Math.PI
  const speed = 10
  const state = {
    position: [{ x, y }],
    direction: 0,
    clockwise: true,
    size
  }

  return {
    update,
    getState
  }

  function update(seconds, input, bodies) {
    move(seconds, input)
    const collisions = bodies.filter(isColliding)
    const obstacles = collisions.filter(eat)
    if (obstacles.length && state.size > 5) {
      state.size -= seconds * 5
    }
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

function Body(size, orbit=0, period=1, parent) {
  let angle = 0
  const speed = Math.PI * 2 / period
  const instance = {
    update(seconds) {
      angle += speed * seconds
      return instance
    },
    getState() {
      const origin = parent ? parent.getState() : { x: 0, y: 0 }
      return {
        x: origin.x + Math.cos(angle) * orbit,
        y: origin.y + Math.sin(angle) * orbit,
        size: size
      }
    },
    consume() {
      let consumed = size * 0.5
      size = 0
      return consumed
    },
    get isConsumed() {
      return size === 0
    },
    isLargerThan(otherSize) {
      return size >= otherSize
    }
  }
  return instance
}
