function Game(input) {
  const snake = Snake(-500, 0)
  const planet = Body(150)
  const moon = Body(15, 200, 10, planet)
  const galaxy = Galaxy(planet, moon)

  return {
    update,
    getState
  }

  function update(seconds) {
    galaxy.update(seconds)
    snake.update(seconds, input)
  }

  function getState() {
    return {
      snake: snake.getState(),
      bodies: galaxy.getState()
    }
  }
}

function Snake(x, y) {
  const turnSpeed = Math.PI
  const speed = 10
  const state = {
    position: [{ x, y }],
    direction: 0,
    clockwise: true,
    size: 10
  }

  return {
    update,
    getState
  }

  function update(seconds, input) {
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

  function getState() {
    return Object.assign({
      x: state.position[0].x,
      y: state.position[0].y
    }, state)
  }
}

function Galaxy(...bodies) {
  return {
    update(seconds) { bodies.forEach(body => body.update(seconds)) },
    getState() { return bodies.map(body => body.getState()) }
  }
}

function Body(size, orbit=0, period=1, parent) {
  const speed = Math.PI * 2 / period
  let angle = 0
  return {
    update(seconds) {
      angle += speed * seconds
    },
    getState() {
      const origin = parent ? parent.getState() : { x: 0, y: 0 }
      return {
        x: origin.x + Math.cos(angle) * orbit,
        y: origin.y + Math.sin(angle) * orbit,
        size: size
      }
    }
  }
}
