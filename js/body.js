function Body(size, color='#80FFEC', orbit=0, period=1, parent) {
  let angle = 0
  const speed = Math.PI * 2 / period
  const body = {
    size,
    color,
    orbit,
    update,
    consume,
    get isConsumed() {
      return this.size === 0
    },
    isLargerThan(size) {
      return this.size > size
    },
    get distance() {
      if (!parent) return this.size
      if (parent) return this.orbit + this.size + parent.distance - parent.size
    },
    get x() {
      const x0 = parent ? parent.x : 0
      return x0 + Math.cos(angle) * this.orbit
    },
    get y() {
      const y0 = parent ? parent.y : 0
      return y0 + Math.sin(angle) * this.orbit
    }
  }

  return body

  function update(seconds) {
    angle += seconds * speed
  }

  function consume() {
    let consumed = body.size * EATING_EFFICIENCY
    body.size = 0
    return consumed
  }
}
