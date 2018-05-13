// Import enemies here:
import { Weasel, Golem } from './enemies';
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
      let monster;
      if (enemy.type === 'weasel') {
        monster = new Weasel(game, enemy.name, enemy.x, enemy.y, enemy.health);
      } else if (enemy.type === 'golem') {
        monster = new Golem(game, enemy.name, enemy.x, enemy.y, enemy.health);
      }

      monster.speed =
        monster.minSpeed + Math.floor(Math.random() * monster.speedVariation);

      monster.sprite.body.setCollisionGroup(enemiesCollisionGroup);
      monster.sprite.body.collides(collidesWithEnemiesArr);

      monster.sprite.body.onBeginContact.add(other => {
        if (other.sprite) {
          if (other.sprite.key === 'bullet') {
            monster.sprite.damage(other.sprite.damageAmount);
            other.sprite.kill();

            socket.emit('enemyHit', {
              health: monster.sprite.health,
              name: monster.name,
              gameId: D6Dungeon.game.state.gameId
            });
          } else if (other.sprite.key === 'dummyBullet') {
            other.sprite.kill();
          }
        }
      });

      enemiesArr.push(monster);
    });
  }

  return enemiesArr;
};
