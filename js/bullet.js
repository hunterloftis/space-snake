function Bullet(x, y, angle) {
  const speed = 1500
  const bullet = {
    x,
    y,
    angle,
    speed,
    life: 2,
    update
  }

  return bullet

  function update(seconds, snake) {
    bullet.x += Math.cos(bullet.angle) * speed * seconds
    bullet.y += Math.sin(bullet.angle) * speed * seconds
    bullet.life -= seconds
    if (snake.distanceFrom(bullet.x, bullet.y) < snake.size) {
      snake.takeDamage(0.015)
      bullet.life = 0
    }
  }
}
