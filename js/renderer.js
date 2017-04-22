function Renderer(canvas) {
  const ctx = canvas.getContext('2d')
  window.addEventListener('resize', fit);
  fit()

  return {
    render
  }

  function fit() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
  }

  function render(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    renderSnake(state.snake)
  }

  function renderSnake(state) {
    const pos = state.position[0]
    ctx.fillStyle = 'red'
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }
}
