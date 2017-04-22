const SUN_COLOR = '#ECFEAA'
const BODY_COLOR = '#7798AB'

function Game(input) {
  const snake = Snake(400, 600, 5)
  const bodies = Bodies(123, 9)
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

function Bodies(seed, prewarm = 0) {
  const rand = Random(seed)
  const sun = Body(650, '#ECFEAA')
  const bodies = [ sun ]
  const spacing = 10

  // small planets near the sun
  while (bodies.length < 20) {
    let size = rand() * 15 + 5
    let orbit = distance() + size + 10 * spacing
    let period = (rand() + 1) / 9000 * Math.PI * orbit * orbit
    let planet = Body(size, BODY_COLOR, orbit, period, sun)
    bodies.push(planet)
    let moons = Math.floor(rand() * 5) + 1
    while (moons-- > 0) {
      let size = rand() * 2 + 2
      let localOrbit = distance() - planet.distance + size + (rand() + 3) * spacing
      let period = rand() * 5 + 3
      let moon = Body(size, BODY_COLOR, localOrbit, period, planet)
      bodies.push(moon)
    }
  }

  bodies.forEach(body => body.update(prewarm))
  return bodies

  function distance() {
    return bodies.reduce((max, body) => Math.max(max, body.distance), 0)
  }
}

function Random(seed) {
  return () => {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
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

function Body(size, color='#80FFEC', orbit=0, period=1, parent) {
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
        size,
        color,
        orbit
      }
    },
    consume() {
      let consumed = size * 0.2
      size = 0
      return consumed
    },
    get isConsumed() {
      return size === 0
    },
    isLargerThan(otherSize) {
      return size >= otherSize
    },
    get distance() {
      if (!parent) return size
      if (parent) return orbit + size + parent.distance - parent.getState().size
    }
  }
  return instance
}
