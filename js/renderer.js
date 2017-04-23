const SHIP_COLOR = '#F6F8FF'

function Renderer(canvas) {
  const ctx = canvas.getContext('2d')
  const camera = Camera()
  const stars = new Array(500).fill(null).map(star => ({
    x: Math.random() * 2000 - 1000,
    y: Math.random() * 2000 - 1000,
    size: Math.random() * 1,
    color: 'white'
  }))
  window.addEventListener('resize', fit)
  fit()

  return { render }

  function fit() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
  }

  function render(state, seconds) {
    const center = { x: canvas.width * 0.5, y: canvas.height * 0.5 }
    camera.update(state.snake, seconds)
    const parallax = 0.25 * camera.zoom
    ctx.fillStyle = '#272B3D'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(center.x, center.y)
    ctx.translate(-camera.x * parallax, -camera.y * parallax)
    renderStars()
    ctx.translate(camera.x * parallax, camera.y * parallax)
    ctx.scale(camera.zoom, camera.zoom)
    ctx.translate(-camera.x, -camera.y)
    renderBodies(state.bodies)
    renderSnake(state.snake)
    renderShips(state.ships)
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
    circle(snake.x, snake.y, snake.size * snake.damage, '#fff')
  }

  function renderShips(ships) {
    ships.forEach(ship => {
      const noseX = ship.x + Math.cos(ship.angle) * ship.size
      const noseY = ship.y + Math.sin(ship.angle) * ship.size
      const lWingX = ship.x + Math.cos(ship.angle + Math.PI * 0.80) * ship.size
      const lWingY = ship.y + Math.sin(ship.angle + Math.PI * 0.80) * ship.size
      const rWingX = ship.x + Math.cos(ship.angle - Math.PI * 0.80) * ship.size
      const rWingY = ship.y + Math.sin(ship.angle - Math.PI * 0.80) * ship.size
      ctx.fillStyle = SHIP_COLOR
      ctx.beginPath()
      ctx.moveTo(noseX, noseY)
      ctx.lineTo(rWingX, rWingY)
      ctx.lineTo(lWingX, lWingY)
      ctx.closePath()
      ctx.fill()

      // const testX = ship.x + Math.cos(ship.angle) * ship.size * 100
      // const testY = ship.y + Math.sin(ship.angle) * ship.size * 100
      // ctx.beginPath()
      // ctx.moveTo(noseX, noseY)
      // ctx.lineTo(testX, testY)
      // ctx.strokeStyle = '#fff'
      // ctx.lineWidth = 1
      // ctx.stroke()
    })
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
  const camera = {
    x: 0,
    y: 0,
    zoom: 1,
    update
  }

  return camera

  function update(target, seconds) {
    const targetZoom = (neutralScale / target.size * 0.95) + 0.05
    const delta = {
      x: target.x - camera.x,
      y: target.y - camera.y,
      zoom: targetZoom - camera.zoom
    }
    const correction = Math.min(seconds, 1)
    camera.x += delta.x * correction
    camera.y += delta.y * correction
    camera.zoom += delta.zoom * correction
  }
}
