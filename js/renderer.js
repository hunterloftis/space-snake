const SPACE_COLOR = '#272B3D'
const SHIP_COLOR = '#F6F8FF'
const SNAKE_COLOR = '#EC4E20'
const SNAKE_HEAD_COLOR = '#fff'
const BULLET_COLOR = '#fff'

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
    ctx.fillStyle = SPACE_COLOR
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
    renderShips(state.ships, seconds)
    ctx.restore()
  }

  function renderStars() {
    stars.forEach(star => circle(star.x, star.y, star.size, star.color))
  }

  function renderBodies(bodies) {
    bodies.forEach(body => circle(body.x, body.y, body.size, body.color))
  }

  function renderSnake(snake) {
    const evo = snake.evolution
    renderAntenna(snake, 0.2, snake.size * 2.5 * evo)
    renderAntenna(snake, 0.4, snake.size * 2 * evo)
    renderSpine(snake, 0.03, snake.size * 3 * evo)
    renderSpine(snake, 0.1, snake.size * 4 * evo)
    renderLegs(snake, snake.size * 0.25 * evo)
    circle(snake.x, snake.y, snake.size, SNAKE_HEAD_COLOR)
    snake.position.slice(2).forEach(pos => circle(pos.x, pos.y, pos.size, SNAKE_COLOR))
    circle(snake.x, snake.y, snake.size * snake.damage, SPACE_COLOR)
    snake.particles.forEach(particle => circle(particle.x, particle.y, particle.size, SNAKE_COLOR))
  }

  function renderLegs(snake, size) {
    for (var i = 0.33; i <= 0.66; i += 0.11) {
      let segment = Math.floor(i * snake.position.length)
      let pos = snake.position[segment]
      let left = angled(pos.x, pos.y, pos.direction - Math.PI * 0.5, pos.size + size)
      let right = angled(pos.x, pos.y, pos.direction + Math.PI * 0.5, pos.size + size)
      circle(left.x, left.y, size, SNAKE_COLOR)
      circle(right.x, right.y, size, SNAKE_COLOR)
    }
  }

  function renderAntenna(snake, tilt, size) {
    const antennaL = angled(snake.x, snake.y, snake.direction - Math.PI * tilt, size)
    const antennaR = angled(snake.x, snake.y, snake.direction + Math.PI * tilt, size)
    line(snake.x, snake.y, antennaL.x, antennaL.y, SNAKE_COLOR, snake.size * 0.2)
    line(snake.x, snake.y, antennaR.x, antennaR.y, SNAKE_COLOR, snake.size * 0.2)
  }

  function renderSpine(snake, tilt, size) {
    const pos = snake.position
    const tail = pos.length - 1
    const spineL = angled(pos[tail].x, pos[tail].y, pos[tail].direction + Math.PI - Math.PI * tilt, size)
    const spineR = angled(pos[tail].x, pos[tail].y, pos[tail].direction + Math.PI + Math.PI * tilt, size)
    line(pos[tail].x, pos[tail].y, spineL.x, spineL.y, SNAKE_COLOR, pos[tail].size * 0.2)
    line(pos[tail].x, pos[tail].y, spineR.x, spineR.y, SNAKE_COLOR, pos[tail].size * 0.2)
  }

  function angled(x0, y0, angle, distance) {
    return {
      x: x0 + Math.cos(angle) * distance,
      y: y0 + Math.sin(angle) * distance
    }
  }

  function renderShips(ships, seconds) {
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

      ctx.strokeStyle = BULLET_COLOR
      ctx.lineWidth = 10
      ctx.beginPath()
      ship.bullets.forEach(bullet => {
        const len = -bullet.speed * seconds
        ctx.moveTo(bullet.x, bullet.y)
        ctx.lineTo(bullet.x + Math.cos(bullet.angle) * len, bullet.y + Math.sin(bullet.angle) * len)
      })
      ctx.stroke()
    })
  }

  function circle(x, y, r, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }

  function line(x1, y1, x2, y2, color, width=2) {
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
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
