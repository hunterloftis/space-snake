function Input() {
  const state = { left: false, right: false }
  document.addEventListener('keydown', onKey, false)
  return state

  function onKey(e) {
    Object.assign(state, {
      left: e.keyCode === 37,
      right: e.keyCode === 39
    })
    e.preventDefault && e.preventDefault()
    e.stopPropagation && e.stopPropagation()
  }
}
