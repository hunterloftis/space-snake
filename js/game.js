function Game() {
  const snake = Snake()

  return {
    get state() {
      return { snake: snake.state }
    }
  }
}

function Snake() {
  let state = {
    position: [{ x: 0, y: 0 }]
  }

  return {
    update,
    get state() { return state }
  }

  function update(time) {

  }
}
