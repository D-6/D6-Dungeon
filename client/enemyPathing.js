export const enemyPathing = (easystar, enemy, target, enemySpeed) => {
  let enemyX = Math.floor(enemy.worldPosition.x / 64);
  let enemyY = Math.floor(enemy.worldPosition.y / 64);
  let nextEnemyX;
  let nextEnemyY;
  let targetX = Math.floor(target.worldPosition.x / 64);
  let targetY = Math.floor(target.worldPosition.y / 64);

  easystar.findPath(enemyX, enemyY, targetX, targetY, path => {
    if (path === null) {
      console.log('Path not found');
    }

    if (path && path.length) {
      nextEnemyX = path[1].x;
      nextEnemyY = path[1].y;
    }

    if (nextEnemyX - enemyX > 0) enemy.body.velocity.x = enemySpeed;
    if (nextEnemyX - enemyX < 0) enemy.body.velocity.x = -enemySpeed;
    if (nextEnemyY - enemyY > 0) enemy.body.velocity.y = enemySpeed;
    if (nextEnemyY - enemyY < 0) enemy.body.velocity.y = -enemySpeed;
  });

  easystar.calculate();
};
