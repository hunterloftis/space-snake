function Game() {
  const snake = Snake()

  return {
    update,
    getState
  }

  function update(seconds) {
    snake.update(seconds)
  }

  function getState() {
    return {
      snake: snake.getState()
    }
  }
}

function Snake() {
  const turnSpeed = Math.PI
  const speed = 10
  const state = {
    position: [{ x: 0, y: 0 }],
    direction: 0,
    clockwise: true,
    size: 10
  }

  return {
    update,
    getState
  }

  function update(seconds) {
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
