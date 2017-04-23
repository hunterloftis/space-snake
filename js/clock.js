function Clock(fps, game, renderer) {
  const fixedStep = 1000 / fps
  const toSeconds = 1 / 1000
  let timeBuffer = 0
  let ticks = [ performance.now() ]
  let running = true
  frame()

  return {
    stop() { running = false }
  }

  function frame() {
    if (!running) return
    ticks.unshift(performance.now())
    const step = Math.min(ticks[0] - ticks.pop(), 250)
    timeBuffer += step
    while (timeBuffer >= fixedStep) {
      game.update(fixedStep * toSeconds)
      timeBuffer -= fixedStep
    }
    renderer.render(game, step * toSeconds)
    requestAnimationFrame(frame)
  }
}
