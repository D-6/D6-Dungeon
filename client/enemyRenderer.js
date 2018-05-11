// Import enemies here:
import { Weasel } from './enemies';
import socket from './socket';

/* global D6Dungeon */

export const enemyRenderer = (
  game,
  enemiesCollisionGroup,
  collidesWithEnemiesArr
) => {
  const gameRoom = game.state.current;
  const roomEnemiesObj = game.state.enemies[gameRoom];
  const roomEnemiesArr = Object.keys(roomEnemiesObj).map(enemy => {
    return { ...roomEnemiesObj[enemy] };
  });

  let enemiesArr = [];

  if (roomEnemiesArr.length) {
    roomEnemiesArr.forEach(enemy => {
      const weasel = new Weasel(
        game,
        enemy.name,
        enemy.x,
        enemy.y,
        enemy.health
      );

      weasel.speed =
        weasel.minSpeed + Math.floor(Math.random() * weasel.speedVariation);

      weasel.sprite.body.setCollisionGroup(enemiesCollisionGroup);
      weasel.sprite.body.collides(collidesWithEnemiesArr);

      weasel.sprite.body.onBeginContact.add(other => {
        if (other.sprite) {
          if (other.sprite.key === 'bullet') {
            weasel.sprite.damage(other.sprite.damageAmount);
            other.sprite.kill();

            socket.emit('enemyHit', {
              health: weasel.sprite.health,
              name: weasel.name,
              gameId: D6Dungeon.game.state.gameId
            });
          } else if (other.sprite.key === 'dummyBullet') {
            other.sprite.kill();
          }
        }
      });

      enemiesArr.push(weasel);
    });
  }

  return enemiesArr;
};
