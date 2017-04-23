function Bodies(seed, prewarm = 0) {
  const rand = Random(seed)
  const sun = Body(650, '#ECFEAA')
  const bodies = [ sun ]
  const ships = []
  const spacing = 10

  // small planets near the sun
  while (bodies.length < 20) {
    let size = rand() * 15 + 5
    let orbit = distance() + size + 10 * spacing
    let period = (rand() + 1) / 50 * 2 * Math.PI * orbit
    let planet = Body(size, BODY_COLOR, orbit, period, sun)
    bodies.push(planet)
    let moons = Math.floor(rand() * 5) + 1
    while (moons-- > 0) {
      let size = rand() * 2 + 2
      let localOrbit = distance() - planet.distance + size + (rand() + 3) * spacing
      let period = rand() * 5 + 4
      let moon = Body(size, BODY_COLOR, localOrbit, period, planet)
      bodies.push(moon)
    }
  }

  // dangerous asteroid belt
  while (bodies.length < 50) {
    let size = Math.sqrt(rand() * 800)
    let orbit = distance() + size + spacing
    let period = (rand() + 3) / 2000 * 2 * Math.PI * orbit
    let asteroid = Body(size, BODY_COLOR, orbit, period, sun)
    bodies.push(asteroid)
  }

  // large planets with defenses
  let planet = Body(300, BODY_COLOR, distance() + 1500, 60, sun)
  bodies.push(planet)
  for (var i = 0; i < 8; i++) {
    ships.push(Ship(planet, 450, Math.PI * 2 * i/8))
  }
  let moon = Body(100, BODY_COLOR, 800, 20, planet)
  bodies.push(moon)

  bodies.forEach(body => body.update(prewarm))
  return [ bodies, ships ]

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

function Ship(home, orbit, angle = 0, size=50) {
  const speed = Math.random() * 12 + 3
  let state = {
    orbiting: true,
    x: undefined,
    y: undefined,
    angle,
    size
  }
  return {
    update,
    getState() { return state }
  }

  function update(seconds, snake) {
    searchFor(snake)
    followOrbit(seconds)
    followTarget(seconds, snake)
  }

  function searchFor(snake) {
    if (!state.orbiting) return
    if (state.x !== undefined && state.y !== undefined) {
      if (snake.distance(state.x, state.y) < 40 * state.size) {
        state.orbiting = false
      }
    }
  }

  function followOrbit(seconds) {
    if (!state.orbiting) return
    state.angle += Math.PI * 2 * seconds / 15
    const root = home.getState()
    const orbitAngle = state.angle - Math.PI * 0.5
    state.x = root.x + Math.cos(orbitAngle) * orbit
    state.y = root.y + Math.sin(orbitAngle) * orbit
  }

  function followTarget(seconds, snake) {
    if (state.orbiting) return
    const snakeState = snake.getState()
    const dx = snakeState.x - state.x
    const dy = snakeState.y - state.y
    const targetAngle = Math.atan2(dy, dx)
    state.angle = targetAngle
    // const fromAngle = mod(state.angle, Math.PI * 2)
    // const diff = mod(fromAngle - targetAngle + Math.PI, Math.PI * 2) - Math.PI
    // const correction = diff < -Math.PI ? diff + Math.PI * 2 : diff
    // state.angle += correction * seconds
    state.x += Math.cos(state.angle) * state.size * speed * seconds
    state.y += Math.sin(state.angle) * state.size * speed * seconds
  }
}

function mod(num, mod) {
  const remain = num % mod
  return Math.floor(remain >= 0 ? remain : remain + mod)
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
      let consumed = size * EATING_EFFICIENCY
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
