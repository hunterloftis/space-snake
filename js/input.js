function Input() {
  const state = { left: false, right: false }
  document.addEventListener('keydown', onKey, false)
  return state

  function onKey(e) {
    const left = e.keyCode === 37
    const right = e.keyCode === 39
    if (left || right) {
      Object.assign(state, { left, right })
      e.preventDefault && e.preventDefault()
      e.stopPropagation && e.stopPropagation()
    }
  }
}
