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
  const position = [{ x: 0, y: 0 }]

  return {
    update,
    getState
  }

  function update(seconds) {
    position[0].x += seconds * 100
  }

  function getState() {
    return {
      position,
      x: position[0].x,
      y: position[0].y
    }
  }
}
