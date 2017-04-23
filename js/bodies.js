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

  // large planet with defenses
  {
    let planet = Body(300, BODY_COLOR, distance() + 1500, 60, sun)
    bodies.push(planet)
    for (var i = 0; i < 7; i++) {
      ships.push(Ship(planet, 450, Math.PI * 2 * i/7))
    }
    let moon = Body(100, BODY_COLOR, 800, 20, planet)
    bodies.push(moon)
  }


  // distant planet with defenses
  {
    let planet = Body(250, BODY_COLOR, distance() + 2000, 120, sun)
    bodies.push(planet)
    for (var i = 0; i < 10; i++) {
      ships.push(Ship(planet, 1200, Math.PI * 2 * i/10))
    }
    let moon1 = Body(50, BODY_COLOR, 800, 20, planet)
    bodies.push(moon1)
    let moon2 = Body(100, BODY_COLOR, 1000, 10, planet)
    bodies.push(moon2)
  }

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
