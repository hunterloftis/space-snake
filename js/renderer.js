function Renderer(canvas) {
  const ctx = canvas.getContext('2d')
  const camera = Camera()
  const stars = new Array(1000).fill(null).map(star => ({
    x: Math.random() * 2000 - 1000,
    y: Math.random() * 2000 - 1000,
    r: Math.random() * 2,
    color: 'white'
  }))
  window.addEventListener('resize', fit)
  fit()

  return {
    render
  }

  function fit() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
  }

  function render(state, seconds) {
    const center = { x: canvas.width * 0.5, y: canvas.height * 0.5 }
    const cam = camera.update(state.snake, seconds)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(center.x - cam.x, center.y - cam.y)
    renderStars()
    renderSnake(state.snake)
    ctx.restore()
  }

  function renderStars() {
    stars.forEach(star => circle(star.x, star.y, star.r, star.color))
  }

  function renderSnake(snake) {
    snake.position.forEach(pos => circle(pos.x, pos.y, snake.size, 'red'))
  }

  function circle(x, y, r, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }
}

function Camera() {
  const state = { x: 0, y: 0 }

  return {
    update
  }

  function update(snake, seconds) {
    const delta = { x: snake.x - state.x, y: snake.y - state.y }
    const correction = Math.min(seconds, 1)
    state.x += delta.x * correction
    state.y += delta.y * correction
    return state
  }
}
