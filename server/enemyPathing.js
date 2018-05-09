export const enemyPathing = (easystar, enemy, target) => {
  let enemyX = Math.floor(enemy.sprite.worldPosition.x / 64);
  let enemyY = Math.floor(enemy.sprite.worldPosition.y / 64);
  let nextEnemyX;
  let nextEnemyY;

  let targetX = Math.floor(target.sprite.worldPosition.x / 64);
  let targetY = Math.floor(target.sprite.worldPosition.y / 64);

  easystar.findPath(enemyX, enemyY, targetX, targetY, path => {
    if (path === null) {
      console.log('Path not found');
    }

    if (path && path.length) {
      nextEnemyX = path[1].x;
      nextEnemyY = path[1].y;
    }

    if (nextEnemyX - enemyX > 0) enemy.sprite.body.velocity.x = enemy.speed;
    if (nextEnemyX - enemyX < 0) enemy.sprite.body.velocity.x = -enemy.speed;
    if (nextEnemyY - enemyY > 0) enemy.sprite.body.velocity.y = enemy.speed;
    if (nextEnemyY - enemyY < 0) enemy.sprite.body.velocity.y = -enemy.speed;
  });

  easystar.calculate();
};
