function Clock(fps, game, renderer) {
  const fixedStep = 1000 / fps
  let timeBuffer = 0
  let ticks = [ performance.now() ]
  frame()

  function frame() {
    ticks.unshift(performance.now())
    const step = ticks.pop() - ticks[0]
    timeBuffer += step
    while (timeBuffer >= fixedStep) {
      game.update(fixedStep)
      timeBuffer -= fixedStep
    }
    renderer.render(game.state, step)
    requestAnimationFrame(frame)
  }
}
