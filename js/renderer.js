function Renderer(canvas) {
  const ctx = canvas.getContext('2d')
  const camera = Camera()
  const stars = new Array(1000).fill(null).map(star => ({
    x: Math.random() * 3000 - 1500,
    y: Math.random() * 3000 - 1500,
    size: Math.random() * 1,
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
    const parallax = 0.25 * cam.zoom
    // cam.zoom = 0.25
    ctx.fillStyle = '#272B3D'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(center.x, center.y)
    ctx.translate(-cam.x * parallax, -cam.y * parallax)
    renderStars()
    ctx.translate(cam.x * parallax, cam.y * parallax)
    ctx.scale(cam.zoom, cam.zoom)
    ctx.translate(-cam.x, -cam.y)
    renderBodies(state.bodies)
    renderSnake(state.snake)
    ctx.restore()
  }

  function renderStars() {
    stars.forEach(star => circle(star.x, star.y, star.size, star.color))
  }

  function renderBodies(bodies) {
    bodies.forEach(body => circle(body.x, body.y, body.size, body.color))
  }

  function renderSnake(snake) {
    circle(snake.x, snake.y, snake.size, '#fff')
    snake.position.slice(2).forEach(pos => circle(pos.x, pos.y, snake.size, '#EC4E20'))
    circle(snake.x, snake.y, snake.size * snake.damage, '#000')
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
  const neutralScale = 10
  const state = { x: 0, y: 0, zoom: 1 }

  return {
    update
  }

  function update(target, seconds) {
    const targetZoom = neutralScale / target.size
    const delta = {
      x: target.x - state.x,
      y: target.y - state.y,
      zoom: targetZoom - state.zoom
    }
    const correction = Math.min(seconds, 1)
    Object.keys(state).forEach(key => state[key] += delta[key] * correction)
    return state
  }
}
